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

const BRAND_LOGOS = [
  { name: "Pokemon", icon: "P", color: "#FFCB05" },
  { name: "Magic: The Gathering", icon: "M", color: "#F38020" },
  { name: "Yu-Gi-Oh!", icon: "Y", color: "#6B3FA0" },
  { name: "Mitos y Leyendas", icon: "ML", color: "#1D6E3A" },
  { name: "Dragon Shield", icon: "DS", color: "#C62828" },
  { name: "Ultra Pro", icon: "UP", color: "#1565C0" },
  { name: "Altered TCG", icon: "A", color: "#00897B" },
  { name: "Flesh and Blood", icon: "FB", color: "#B71C1C" },
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

      {/* Social section */}
      {tenant.social_links && tenant.social_links.length > 0 && (
        <div className="bg-gray-50 py-10 border-t border-gray-200">
          <div className="store-container text-center">
            <h2 className="text-gray-900 text-lg font-bold uppercase tracking-wider mb-2">
              Siguenos en redes sociales
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enterate de las novedades y ofertas exclusivas
            </p>
            <div className="flex justify-center gap-4">
              {tenant.social_links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[var(--store-primary)] hover:text-[var(--store-primary)] flex items-center justify-center text-gray-500 transition-all duration-200"
                >
                  {link.platform.toUpperCase() === "FACEBOOK" && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  )}
                  {link.platform.toUpperCase() === "INSTAGRAM" && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  )}
                  {link.platform.toUpperCase() === "WHATSAPP" && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  )}
                  {link.platform.toUpperCase() === "TIKTOK" && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
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
