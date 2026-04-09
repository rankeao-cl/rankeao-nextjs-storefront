"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts, getCategories, addCartItem } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import ProductGrid from "@/components/ui/ProductGrid";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import type { Product } from "@/lib/types/store";
import { toast } from "@heroui/react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Magnifier } from "@gravity-ui/icons";
import { useState } from "react";

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
    <div className="store-container py-8">
      {/* D10: Breadcrumbs */}
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Catalogo" },
        ...(categoria ? [{ label: categories.find(c => (c.slug || c.id) === categoria)?.name || categoria }] : []),
      ]} />
      <h1 className="section-title mb-6">Catalogo</h1>

      {/* E2: Filters grouped in card */}
      <div className="surface-card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 bg-[var(--field-background)] text-foreground placeholder:text-[var(--field-placeholder)] border border-border rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--store-primary)]"
            />
            <button type="submit" className="bg-[var(--store-primary)] text-white px-4 rounded-r-lg hover:brightness-110 transition-all">
              <Magnifier className="w-5 h-5" />
            </button>
          </form>

          {/* E3: Custom select dropdowns */}
          <div className="relative">
            <select
              value={categoria}
              onChange={(e) => updateParam("categoria", e.target.value)}
              className="appearance-none bg-[var(--field-background)] text-foreground border border-border rounded-lg pl-4 pr-9 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[var(--store-primary)]"
            >
              <option value="">Todas las categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="appearance-none bg-[var(--field-background)] text-foreground border border-border rounded-lg pl-4 pr-9 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-[var(--store-primary)]"
            >
              <option value="recent">Mas recientes</option>
              <option value="popular">Mas populares</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* D7: Active filter chips */}
      {(categoria || q || onSale) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {q && (
            <span className="inline-flex items-center gap-1.5 bg-[var(--store-primary-light)] text-[var(--store-primary)] text-sm font-medium px-3 py-1.5 rounded-full">
              Busqueda: &ldquo;{q}&rdquo;
              <button onClick={() => { setSearchInput(""); updateParam("q", ""); }} className="hover:bg-[var(--store-primary-medium)] rounded-full p-0.5" aria-label="Quitar filtro">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
          {categoria && (
            <span className="inline-flex items-center gap-1.5 bg-[var(--store-primary-light)] text-[var(--store-primary)] text-sm font-medium px-3 py-1.5 rounded-full">
              Categoria: {categories.find(c => (c.slug || c.id) === categoria)?.name || categoria}
              <button onClick={() => updateParam("categoria", "")} className="hover:bg-[var(--store-primary-medium)] rounded-full p-0.5" aria-label="Quitar filtro">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
          {onSale && (
            <span className="inline-flex items-center gap-1.5 bg-[var(--store-primary-light)] text-[var(--store-primary)] text-sm font-medium px-3 py-1.5 rounded-full">
              En oferta
              <button onClick={() => updateParam("on_sale", "")} className="hover:bg-[var(--store-primary-medium)] rounded-full p-0.5" aria-label="Quitar filtro">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* D8: Results count */}
      {meta && !isLoading && (
        <p className="text-sm text-muted mb-4">
          Mostrando {Math.min((page - 1) * 20 + 1, meta.total || 0)}-{Math.min(page * 20, meta.total || 0)} de {meta.total || 0} productos
        </p>
      )}

      {/* Results */}
      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : (
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      )}

      {/* Pagination - truncated */}
      {meta && meta.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
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
                <span key={p + idx} className="w-10 h-10 flex items-center justify-center text-muted text-sm">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => updateParam("page", String(p))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-[var(--store-primary)] text-white"
                      : "bg-[var(--field-background)] text-foreground hover:bg-[var(--surface-secondary)]"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}
        </div>
      )}
    </div>
  );
}
