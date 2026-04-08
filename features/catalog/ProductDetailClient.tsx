"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getProductDetail, addCartItem, getTenantProducts } from "@/lib/api/store";
import { useTenant } from "@/context/TenantContext";
import ProductCarousel from "@/components/ui/ProductCarousel";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types/store";
import { formatPrice, getDiscountPercent } from "@/lib/utils/format";
import { ShoppingCart, ArrowLeft } from "@gravity-ui/icons";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";

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

  const product = data?.data?.product;

  // D6: Related products from same category
  const { data: relatedData } = useQuery({
    queryKey: ["related-products", tenant.slug, product?.category_id],
    queryFn: () => getTenantProducts(tenant.slug, {
      category: product?.category_id || undefined,
      per_page: 12,
    }),
    enabled: !!product?.category_id,
  });

  const relatedProducts = (relatedData?.products ?? []).filter(p => p.id !== productId);

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
      <div className="store-container py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-[var(--surface)] rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-[var(--surface-secondary)] rounded w-3/4" />
            <div className="h-4 bg-[var(--surface)] rounded w-1/2" />
            <div className="h-10 bg-[var(--surface-secondary)] rounded w-1/3 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="store-container py-16 text-center">
        <p className="text-muted text-lg">Producto no encontrado</p>
        <Link href="/catalogo" className="text-[var(--store-primary)] hover:underline mt-4 inline-block">
          Volver al catalogo
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage]?.url;
  const discount = product.compare_at_price
    ? getDiscountPercent(product.price || 0, product.compare_at_price)
    : 0;

  return (
    <div className="store-container py-8">
      {/* D10: Breadcrumbs */}
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Catalogo", href: "/catalogo" },
        ...(product.category_name ? [{ label: product.category_name, href: `/catalogo?categoria=${product.category_id || ""}` }] : []),
        { label: product.name || product.title || "Producto" },
      ]} />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-[var(--surface)] rounded-xl overflow-hidden mb-4">
            {discount > 0 && <div className="discount-badge text-base">-{discount}%</div>}
            {currentImage ? (
              <Image src={currentImage} alt={product.name || ""} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">Sin imagen</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                    i === selectedImage ? "border-[var(--store-primary)]" : "border-transparent"
                  }`}
                >
                  <Image src={img.url} alt="" width={64} height={64} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name || product.title}</h1>

          {product.category_name && (
            <p className="text-sm text-muted mb-1">{product.category_name}</p>
          )}
          {product.game_name && (
            <p className="text-sm text-muted mb-4">{product.game_name}</p>
          )}

          <div className="mb-6">
            {product.compare_at_price && product.compare_at_price > (product.price || 0) && (
              <p className="text-lg text-muted line-through">{formatPrice(product.compare_at_price, product.currency)}</p>
            )}
            <p className="text-3xl font-bold text-[var(--store-primary)]">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock !== undefined && product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-success bg-success/10 px-3 py-1 rounded-full">
                {product.stock} disponible{product.stock > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-danger bg-danger/10 px-3 py-1 rounded-full">
                Agotado
              </span>
            )}
          </div>

          {/* Quantity + Add to Cart + Buy Now */}
          {product.stock !== undefined && product.stock > 0 && (
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-foreground hover:bg-[var(--surface)]"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-foreground font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="px-3 py-2 text-foreground hover:bg-[var(--surface)]"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--store-primary)] hover:brightness-110 text-white font-semibold rounded-lg transition-all disabled:opacity-70"
                >
                  {isAddingToCart ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {isAddingToCart ? "Agregando..." : "Agregar al carrito"}
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-[var(--surface-solid)] font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
              >
                {isBuyingNow ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
                {isBuyingNow ? "Procesando..." : "Comprar ahora"}
              </button>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-3">Descripcion</h3>
              <p className="text-sm text-muted whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* E4: Card details as badge pills */}
          {(product.card_condition || product.is_foil) && (
            <div className="border-t border-border pt-6 mt-6">
              <h3 className="font-semibold text-foreground mb-3">Detalles</h3>
              <div className="flex flex-wrap gap-2">
                {product.card_condition && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--surface)] text-foreground px-3 py-1.5 rounded-full border border-border">
                    <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {product.card_condition}
                  </span>
                )}
                {product.is_foil && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Foil
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* D6: Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-extrabold text-foreground mb-6">Productos relacionados</h2>
          <ProductCarousel products={relatedProducts} onAddToCart={handleRelatedAddToCart} />
        </div>
      )}
    </div>
  );
}
