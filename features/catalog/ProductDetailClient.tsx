"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getProductDetail, addCartItem, getTenantProducts } from "@/lib/api/store";
import { useTenant } from "@/context/TenantContext";
import ProductCarousel from "@/components/ui/ProductCarousel";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils/format";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import { FadeUp } from "@/lib/motion";

export default function ProductDetailClient({ productId }: { productId: string }) {
  const tenant = useTenant();
  const router = useRouter();
  const increment = useCartStore((s) => s.increment);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId),
  });

  const product = data?.data;
  const stockCount = typeof product?.stock === "number" ? product.stock : undefined;
  const isAvailable = stockCount !== undefined ? stockCount > 0 : product?.in_stock !== false;

  const { data: relatedData } = useQuery({
    queryKey: ["related-products", tenant.slug, product?.category_id],
    queryFn: () => getTenantProducts(tenant.slug, { category: product?.category_id || undefined, per_page: 12 }),
    enabled: !!product?.category_id,
  });

  const relatedProducts = (
    product?.related_products?.length ? product.related_products : (relatedData?.products ?? [])
  ).filter((p) => p.id !== productId);

  async function handleRelatedAddToCart(p: Product) {
    try {
      await addCartItem(tenant.slug, p.id);
      increment();
      toast.success("Producto agregado al carrito");
    } catch {
      toast.danger("Inicia sesion para agregar al carrito");
    }
  }

  async function handleAddToCart() {
    if (!product || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addCartItem(tenant.slug, product.id, quantity);
      increment();
      toast.success("Producto agregado al carrito");
    } catch {
      toast.danger("Inicia sesion para agregar al carrito");
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!product || isBuyingNow) return;
    setIsBuyingNow(true);
    try {
      await addCartItem(tenant.slug, product.id, quantity);
      increment();
      router.push("/checkout");
    } catch {
      toast.danger("Inicia sesion para comprar");
    } finally {
      setIsBuyingNow(false);
    }
  }

  if (isLoading) {
    return (
      <div className="store-container py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div 
            className="aspect-square rounded-3xl skeleton-shimmer"
            style={{ background: "var(--surface)" }}
          />
          <div className="space-y-6">
            <div className="h-8 rounded-xl w-3/4 skeleton-shimmer" style={{ background: "var(--surface)" }} />
            <div className="h-4 rounded w-1/2 skeleton-shimmer" style={{ background: "var(--surface)" }} />
            <div className="h-12 rounded-xl w-1/3 mt-8 skeleton-shimmer" style={{ background: "var(--surface)" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="store-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--surface)" }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Producto no encontrado
          </h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            El producto que buscas no existe o fue eliminado
          </p>
          <Link href="/catalogo" className="btn-primary">
            Volver al catalogo
          </Link>
        </motion.div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage]?.url;
  const discount = product.compare_at_price ? getDiscountPercent(product.price || 0, product.compare_at_price) : 0;

  return (
    <div className="store-container py-8 md:py-12">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          ...(product.category_name ? [{ label: product.category_name, href: `/catalogo?categoria=${product.category_id || ""}` }] : []),
          { label: product.name || product.title || "Producto" },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-6">
        {/* Images */}
        <FadeUp>
          <div 
            className="relative aspect-square rounded-3xl overflow-hidden"
            style={{ background: "var(--surface-tertiary)" }}
          >
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 left-4 z-10 text-sm font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "var(--foreground)", color: "var(--background)" }}
              >
                -{discount}%
              </motion.span>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={product.name || ""}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--muted)" }}>
                    <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all"
                  style={{ 
                    background: "var(--surface-tertiary)",
                    border: i === selectedImage ? "2px solid var(--store-primary)" : "2px solid transparent"
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={img.url}
                    alt=""
                    width={80}
                    height={80}
                    className="object-contain w-full h-full p-1"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </FadeUp>

        {/* Info */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category / Game */}
            {(product.category_name || product.game_name) && (
              <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
                {[product.category_name, product.game_name].filter(Boolean).join(" / ")}
              </p>
            )}

            <h1 
              className="text-2xl md:text-3xl font-bold mb-6 text-balance"
              style={{ color: "var(--foreground)" }}
            >
              {product.name || product.title}
            </h1>

            {/* Price */}
            <div className="mb-8">
              {product.compare_at_price && product.compare_at_price > (product.price || 0) && (
                <p className="text-lg line-through" style={{ color: "var(--muted)" }}>
                  {formatPrice(product.compare_at_price, product.currency)}
                </p>
              )}
              <p 
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "var(--store-primary)" }}
              >
                {formatPrice(product.price, product.currency)}
              </p>
            </div>

            {/* Stock badge */}
            <div className="mb-8">
              {isAvailable ? (
                <span 
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
                  style={{ background: "rgba(34, 197, 94, 0.1)", color: "var(--success)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {stockCount !== undefined ? `${stockCount} disponible${stockCount > 1 ? "s" : ""}` : "Disponible"}
                </span>
              ) : (
                <span 
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
                  style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  Agotado
                </span>
              )}
            </div>

            {/* Quantity + Actions */}
            {isAvailable && (
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div 
                    className="flex items-center rounded-full overflow-hidden"
                    style={{ background: "var(--surface)" }}
                  >
                    <motion.button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 transition-colors"
                      style={{ color: "var(--foreground)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </motion.button>
                    <span 
                      className="px-4 py-3 font-medium min-w-[48px] text-center"
                      style={{ color: "var(--foreground)" }}
                    >
                      {quantity}
                    </span>
                    <motion.button
                      onClick={() => setQuantity(stockCount ? Math.min(stockCount, quantity + 1) : quantity + 1)}
                      className="px-4 py-3 transition-colors"
                      style={{ color: "var(--foreground)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Add to cart */}
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-medium text-white disabled:opacity-70"
                    style={{ background: "var(--store-primary)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isAddingToCart ? (
                      <motion.svg
                        className="w-5 h-5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </motion.svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    )}
                    {isAddingToCart ? "Agregando..." : "Agregar al carrito"}
                  </motion.button>
                </div>

                {/* Buy now */}
                <motion.button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-medium disabled:opacity-70"
                  style={{ 
                    background: "var(--foreground)", 
                    color: "var(--background)" 
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isBuyingNow ? (
                    <motion.svg
                      className="w-5 h-5"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </motion.svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  )}
                  {isBuyingNow ? "Procesando..." : "Comprar ahora"}
                </motion.button>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div 
                className="pt-8"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                  Descripcion
                </h3>
                <p 
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--muted)" }}
                >
                  {product.description}
                </p>
              </div>
            )}

            {/* Card details */}
            {(product.card_condition || product.is_foil) && (
              <div 
                className="pt-8 mt-8"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                  Detalles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.card_condition && (
                    <span 
                      className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
                      style={{ background: "var(--surface)", color: "var(--foreground)" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: "var(--success)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {product.card_condition}
                    </span>
                  )}
                  {product.is_foil && (
                    <span 
                      className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
                      style={{ background: "rgba(251, 191, 36, 0.1)", color: "#d97706" }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Foil
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 md:mt-24 pt-12" style={{ borderTop: "1px solid var(--border)" }}>
          <ProductCarousel
            title="Productos relacionados"
            subtitle="Tambien te puede interesar"
            products={relatedProducts}
            onAddToCart={handleRelatedAddToCart}
          />
        </section>
      )}
    </div>
  );
}
