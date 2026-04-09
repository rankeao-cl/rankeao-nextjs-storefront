"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts } from "@/lib/api/store";
import { addCartItem } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import ImageCarousel from "@/components/ui/ImageCarousel";
import ProductCarousel from "@/components/ui/ProductCarousel";
import CategoryTile from "@/components/ui/CategoryTile";
import type { Product } from "@/lib/types/store";
import type { CarouselSlide } from "@/lib/types/tenant";
import { toast } from "@heroui/react";
import Link from "next/link";

const DEFAULT_SLIDES: CarouselSlide[] = [
  { image_url: "/assets/slider/Slider1.png", alt_text: "Magic The Gathering" },
  { image_url: "/assets/slider/Slider2.png", alt_text: "Avatar" },
  { image_url: "/assets/slider/Slider3.png", alt_text: "Marvel" },
  { image_url: "/assets/slider/Slider4.png", alt_text: "Altered TCG" },
];

const CATEGORY_TILES = [
  {
    image_url: "/assets/baldosas/Baldosas1.png",
    title: "Magic The Gathering",
    link_url: "/catalogo?q=magic",
  },
  {
    image_url: "/assets/baldosas/Baldosas2.png",
    title: "Yu-Gi-Oh!",
    link_url: "/catalogo?q=yugioh",
  },
  {
    image_url: "/assets/baldosas/Baldosas3.png",
    title: "Mitos y Leyendas",
    link_url: "/catalogo?q=mitos",
  },
];

export default function HomeClient() {
  const tenant = useTenant();
  const increment = useCartStore((s) => s.increment);

  const { data: featured, isLoading: l1 } = useQuery({
    queryKey: ["products", tenant.slug, "featured"],
    queryFn: () =>
      getTenantProducts(tenant.slug, { sort: "popular", per_page: 15 }),
  });

  const { data: recent, isLoading: l2 } = useQuery({
    queryKey: ["products", tenant.slug, "recent"],
    queryFn: () =>
      getTenantProducts(tenant.slug, { per_page: 15, sort: "recent" }),
  });

  const { data: onSale, isLoading: l3 } = useQuery({
    queryKey: ["products", tenant.slug, "sale"],
    queryFn: () =>
      getTenantProducts(tenant.slug, { on_sale: true, per_page: 60 }),
  });

  const { data: preorders, isLoading: l4 } = useQuery({
    queryKey: ["products", tenant.slug, "preorders"],
    queryFn: () =>
      getTenantProducts(tenant.slug, {
        category_id: "pre-orders",
        per_page: 15,
      }),
  });

  const onSaleProducts = (onSale?.products ?? []).slice(0, 15);

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

      {/* CATEGORY GALLERY */}
      <section className="store-container py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {(tenant.config?.community_images || categoryTiles).map((img, i) => (
            <CategoryTile key={i} tile={img} />
          ))}
        </div>
      </section>

      {/* OFERTAS */}
      <ProductSection
        title="En Oferta"
        loading={l3}
        products={onSaleProducts}
        onAddToCart={handleAddToCart}
        viewAllHref="/catalogo?on_sale=true"
      />

      {/* PREVENTAS */}
      <ProductSection
        title="En Preventas"
        loading={l4}
        products={preorders?.products}
        onAddToCart={handleAddToCart}
        viewAllHref="/catalogo?categoria=pre-orders"
      />
    </div>
  );
}

/* ── Product Section with horizontal carousel ── */

function ProductSection({
  title,
  loading,
  products,
  onAddToCart,
  viewAllHref,
}: {
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
      <section className="store-container py-10 md:py-16">
        <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-10 skeleton-shimmer" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-lg skeleton-shimmer mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto skeleton-shimmer mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto skeleton-shimmer mb-3" />
              <div className="h-9 bg-gray-100 rounded-lg skeleton-shimmer" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="store-container py-10 md:py-16">
      {/* Section header with title and optional "Ver todos" link */}
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[var(--store-primary)] rounded-full" />
          </h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[var(--store-primary)] transition-colors"
          >
            Ver todos
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      <ProductCarousel products={products} onAddToCart={onAddToCart} />

      {/* Mobile "Ver todos" link */}
      {viewAllHref && (
        <div className="sm:hidden mt-6 text-center">
          <Link
            href={viewAllHref}
            className="btn-press inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--store-primary)] bg-[var(--store-primary)]/10 px-6 py-3 rounded-full hover:bg-[var(--store-primary)]/20 transition-colors"
          >
            Ver todos los productos
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}
