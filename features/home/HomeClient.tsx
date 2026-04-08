"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts } from "@/lib/api/store";
import { addCartItem } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import ImageCarousel from "@/components/ui/ImageCarousel";
import ProductCarousel from "@/components/ui/ProductCarousel";
import type { Product } from "@/lib/types/store";
import type { CarouselSlide } from "@/lib/types/tenant";
import { toast } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_SLIDES: CarouselSlide[] = [
  { image_url: "/assets/slider/Slider1.png", alt_text: "Magic The Gathering" },
  { image_url: "/assets/slider/Slider2.png", alt_text: "Avatar" },
  { image_url: "/assets/slider/Slider3.png", alt_text: "Marvel" },
  { image_url: "/assets/slider/Slider4.png", alt_text: "Altered TCG" },
];

const CATEGORY_TILES = [
  { image_url: "/assets/baldosas/Baldosas1.png", title: "Magic The Gathering", link_url: "/catalogo?q=magic" },
  { image_url: "/assets/baldosas/Baldosas2.png", title: "Yu-Gi-Oh!", link_url: "/catalogo?q=yugioh" },
  { image_url: "/assets/baldosas/Baldosas3.png", title: "Mitos y Leyendas", link_url: "/catalogo?q=mitos" },
];

export default function HomeClient() {
  const tenant = useTenant();
  const increment = useCartStore((s) => s.increment);

  const { data: featured, isLoading: l1 } = useQuery({
    queryKey: ["products", tenant.slug, "featured"],
    queryFn: () => getTenantProducts(tenant.slug, { sort: "popular", per_page: 15 }),
  });

  const { data: recent, isLoading: l2 } = useQuery({
    queryKey: ["products", tenant.slug, "recent"],
    queryFn: () => getTenantProducts(tenant.slug, { per_page: 15, sort: "recent" }),
  });

  const { data: onSale, isLoading: l3 } = useQuery({
    queryKey: ["products", tenant.slug, "sale"],
    queryFn: () => getTenantProducts(tenant.slug, { on_sale: true, per_page: 15 }),
  });

  const { data: preorders, isLoading: l4 } = useQuery({
    queryKey: ["products", tenant.slug, "preorders"],
    queryFn: () => getTenantProducts(tenant.slug, { category: "pre-orders", per_page: 15 }),
  });

  const carouselSlides = tenant.config?.carousel_images?.length
    ? tenant.config.carousel_images
    : DEFAULT_SLIDES;

  const categoryTiles = tenant.config?.category_tiles?.length
    ? tenant.config.category_tiles
    : CATEGORY_TILES;

  async function handleAddToCart(product: Product) {
    try {
      await addCartItem(tenant.slug, product.id);
      increment();
      toast.success("Producto agregado al carrito");
    } catch {
      toast.danger("Inicia sesion para agregar al carrito");
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel - pulls up behind sticky header */}
      <div className="bg-black -mt-[100px]">
        <ImageCarousel slides={carouselSlides} />
      </div>

      {/* SECTION 1: Productos Destacados - right after hero */}
      <div className="bg-[var(--background)]">
        <ProductSection
          title="Productos Destacados"
          subtitle="Los mas buscados por nuestros clientes"
          loading={l1}
          products={featured?.products}
          onAddToCart={handleAddToCart}
          viewAllHref="/catalogo?sort=popular"
          accentColor
        />
      </div>

      {/* SECTION 2: Novedades */}
      <div className="bg-[var(--background)]">
        <ProductSection
          title="Novedades"
          subtitle="Recien llegados a la tienda"
          loading={l2}
          products={recent?.products}
          onAddToCart={handleAddToCart}
          viewAllHref="/catalogo?sort=recent"
        />
      </div>

      {/* COMMUNITY GALLERY */}
      <div className="store-container py-6">
        <div className="grid grid-cols-3 gap-2">
          {(tenant.config?.community_images || categoryTiles).map((img, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden group">
              <Image
                src={img.image_url}
                alt={img.title || ""}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="33vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* OFERTAS */}
      <ProductSection
        title="En Oferta"
        loading={l3}
        products={onSale?.products}
        onAddToCart={handleAddToCart}
        viewAllHref="/catalogo?on_sale=true"
      />

      {/* PREVENTAS */}
      <ProductSection
        title="En Preventas"
        loading={l4}
        products={preorders?.products}
        onAddToCart={handleAddToCart}
        viewAllHref="/catalogo?category=pre-orders"
      />


    </div>
  );
}

/* ── Product Section with horizontal carousel ── */

function ProductSection({ title, loading, products, onAddToCart, viewAllHref }: {
  title: string;
  subtitle?: string;
  loading: boolean;
  products?: Product[];
  onAddToCart: (p: Product) => void;
  viewAllHref?: string;
  accentColor?: boolean;
  badgeText?: string;
}) {
  if (loading) {
    return (
      <div className="store-container py-8 md:py-12">
        <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-8 skeleton-shimmer" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1,2,3,4,5].map(i => (
            <div key={i}>
              <div className="aspect-square bg-gray-100 rounded skeleton-shimmer mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto skeleton-shimmer mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto skeleton-shimmer mb-3" />
              <div className="h-8 bg-gray-100 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="store-container py-8 md:py-12">
      {/* Section title - centered, bold uppercase like bluecard */}
      <h2 className="text-center text-base md:text-lg font-bold text-gray-900 uppercase tracking-wider mb-8 underline underline-offset-8 decoration-2">
        {title}
      </h2>

      <ProductCarousel products={products} onAddToCart={onAddToCart} />

      {/* Mobile "Ver todos" link */}
      {viewAllHref && (
        <div className="sm:hidden mt-4 text-center">
          <Link
            href={viewAllHref}
            className="btn-press inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--store-primary)] bg-[var(--store-primary)]/[0.08] px-5 py-2.5 rounded-lg"
          >
            Ver todos los productos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
