"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts, getCategories, addCartItem } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import ProductGrid from "@/components/ui/ProductGrid";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import type { Product } from "@/lib/types/store";
import { toast } from "@heroui/react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useState } from "react";
import { FadeUp } from "@/lib/motion";

export default function CatalogClient() {
  const tenant = useTenant();
  const searchParams = useSearchParams();
  const router = useRouter();
  const increment = useCartStore((s) => s.increment);

  const categoria = searchParams.get("categoria") || "";
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "recent";
  const onSale = searchParams.get("on_sale") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [searchInput, setSearchInput] = useState(q);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", tenant.slug, categoria, q, sort, onSale, page],
    queryFn: () =>
      getTenantProducts(tenant.slug, {
        category: categoria || undefined,
        q: q || undefined,
        sort,
        on_sale: onSale || undefined,
        page,
        per_page: 20,
      }),
  });

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/catalogo?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", searchInput.trim());
  }

  async function handleAddToCart(product: Product) {
    try {
      await addCartItem(tenant.slug, product.id);
      increment();
      toast.success("Producto agregado al carrito");
    } catch {
      toast.danger("Inicia sesion para agregar al carrito");
    }
  }

  const categories = categoriesData?.data?.categories ?? [];
  const products = data?.products ?? [];
  const meta = data?.meta;

  return (
    <div className="store-container py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Catalogo" },
        ...(categoria ? [{ label: categories.find(c => (c.slug || c.id) === categoria)?.name || categoria }] : []),
      ]} />
      
      <FadeUp>
        <h1 className="section-title mt-4 mb-2">Catalogo</h1>
        <p className="section-subtitle mb-8">Explora todos nuestros productos</p>
      </FadeUp>

      {/* Filters - Clean Apple style */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl p-4 md:p-6 mb-8"
        style={{ background: "var(--surface-solid)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
            <div className="relative flex-1">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5}
                style={{ color: "var(--muted)" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
                style={{ 
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  border: "1px solid transparent"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--store-primary)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
              />
            </div>
            <motion.button 
              type="submit" 
              className="ml-2 px-5 py-3 rounded-xl font-medium text-sm text-white"
              style={{ background: "var(--store-primary)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Buscar
            </motion.button>
          </form>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoria}
              onChange={(e) => updateParam("categoria", e.target.value)}
              className="appearance-none w-full md:w-auto pl-4 pr-10 py-3 rounded-xl text-sm cursor-pointer focus:outline-none"
              style={{ 
                background: "var(--surface)",
                color: "var(--foreground)"
              }}
            >
              <option value="">Todas las categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              style={{ color: "var(--muted)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Sort filter */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="appearance-none w-full md:w-auto pl-4 pr-10 py-3 rounded-xl text-sm cursor-pointer focus:outline-none"
              style={{ 
                background: "var(--surface)",
                color: "var(--foreground)"
              }}
            >
              <option value="recent">Mas recientes</option>
              <option value="popular">Mas populares</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
            <svg 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              style={{ color: "var(--muted)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Active filter chips */}
      {(categoria || q || onSale) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {q && (
            <span 
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
              style={{ background: "var(--store-primary)", color: "white", opacity: 0.9 }}
            >
              &ldquo;{q}&rdquo;
              <button 
                onClick={() => { setSearchInput(""); updateParam("q", ""); }} 
                className="hover:opacity-70 transition-opacity"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {categoria && (
            <span 
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
              style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            >
              {categories.find(c => (c.slug || c.id) === categoria)?.name || categoria}
              <button onClick={() => updateParam("categoria", "")} className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {onSale && (
            <span 
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
              style={{ background: "var(--danger)", color: "white" }}
            >
              En oferta
              <button onClick={() => updateParam("on_sale", "")} className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </motion.div>
      )}

      {/* Results count */}
      {meta && !isLoading && (
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          {meta.total || 0} productos encontrados
        </p>
      )}

      {/* Results with AnimatePresence for filter transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${categoria}-${q}-${sort}-${onSale}-${page}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : (
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--surface)" }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} style={{ color: "var(--muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            No encontramos productos
          </h3>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
            Intenta con otros filtros o terminos de busqueda para encontrar lo que necesitas
          </p>
          <button
            onClick={() => {
              setSearchInput("");
              router.push("/catalogo");
            }}
            className="btn-primary"
          >
            Ver todo el catalogo
          </button>
        </motion.div>
      )}

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mt-16"
        >
          {(() => {
            const total = meta.total_pages;
            const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
            if (total <= 7) {
              for (let i = 1; i <= total; i++) pages.push(i);
            } else {
              pages.push(1);
              if (page > 3) pages.push("ellipsis-start");
              const start = Math.max(2, page - 1);
              const end = Math.min(total - 1, page + 1);
              for (let i = start; i <= end; i++) pages.push(i);
              if (page < total - 2) pages.push("ellipsis-end");
              pages.push(total);
            }
            return pages.map((p, idx) =>
              typeof p === "string" ? (
                <span 
                  key={p + idx} 
                  className="w-11 h-11 flex items-center justify-center text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  ...
                </span>
              ) : (
                <motion.button
                  key={p}
                  onClick={() => updateParam("page", String(p))}
                  className="w-11 h-11 rounded-full text-sm font-medium transition-colors"
                  style={{ 
                    background: p === page ? "var(--store-primary)" : "var(--surface)",
                    color: p === page ? "white" : "var(--foreground)"
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {p}
                </motion.button>
              )
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
