"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts, addCartItem } from "@/lib/api/store";
import { useCartStore } from "@/lib/stores/cart-store";
import ImageCarousel from "@/components/ui/ImageCarousel";
import ProductCarousel from "@/components/ui/ProductCarousel";
import CategoryTile from "@/components/ui/CategoryTile";
import type { Product } from "@/lib/types/store";
import type { CarouselSlide } from "@/lib/types/tenant";
import { toast } from "@heroui/react";
import Link from "next/link";
import { FadeUp, Stagger, StaggerChild } from "@/lib/motion";

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
    queryFn: () => getTenantProducts(tenant.slug, { on_sale: true, per_page: 60 }),
  });

  const { data: preorders, isLoading: l4 } = useQuery({
    queryKey: ["products", tenant.slug, "preorders"],
    queryFn: () => getTenantProducts(tenant.slug, { category_id: "pre-orders", per_page: 15 }),
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
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero Carousel - Full viewport impact */}
      <section className="-mt-14 md:-mt-16">
        <ImageCarousel slides={carouselSlides} />
      </section>

      {/* Featured Products - Primary section */}
      <section className="store-container py-16 md:py-24">
        <ProductCarousel
          title="Productos Destacados"
          subtitle="Los favoritos de nuestros clientes"
          products={featured?.products || []}
          onAddToCart={handleAddToCart}
          viewAllLink="/catalogo?sort=popular"
        />
        {l1 && <ProductSkeleton />}
      </section>

      {/* New Arrivals */}
      <section 
        className="py-16 md:py-24"
        style={{ background: "var(--surface-solid)" }}
      >
        <div className="store-container">
          <ProductCarousel
            title="Novedades"
            subtitle="Recien llegados a la tienda"
            products={recent?.products || []}
            onAddToCart={handleAddToCart}
            viewAllLink="/catalogo?sort=recent"
          />
          {l2 && <ProductSkeleton />}
        </div>
      </section>

      {/* Category Gallery - Visual break */}
      <section className="store-container py-16 md:py-24">
        <FadeUp>
          <h2 className="section-title text-center mb-4">Explora por Categoria</h2>
          <p className="section-subtitle text-center mx-auto mb-12">
            Encuentra exactamente lo que buscas
          </p>
        </FadeUp>
        
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {(tenant.config?.community_images || categoryTiles).map((img, i) => (
            <StaggerChild key={i}>
              <CategoryTile tile={img} />
            </StaggerChild>
          ))}
        </Stagger>
      </section>

      {/* On Sale - Highlight section */}
      {onSaleProducts.length > 0 && (
        <section 
          className="py-16 md:py-24"
          style={{ background: "var(--surface-solid)" }}
        >
          <div className="store-container">
            <ProductCarousel
              title="En Oferta"
              subtitle="Aprovecha estos precios especiales"
              products={onSaleProducts}
              onAddToCart={handleAddToCart}
              viewAllLink="/catalogo?on_sale=true"
            />
            {l3 && <ProductSkeleton />}
          </div>
        </section>
      )}

      {/* Pre-orders */}
      {(preorders?.products?.length ?? 0) > 0 && (
        <section className="store-container py-16 md:py-24">
          <ProductCarousel
            title="Preventas"
            subtitle="Reserva antes que nadie"
            products={preorders?.products || []}
            onAddToCart={handleAddToCart}
            viewAllLink="/catalogo?categoria=pre-orders"
          />
          {l4 && <ProductSkeleton />}
        </section>
      )}

      {/* Newsletter / CTA Section */}
      <section 
        className="py-20 md:py-28"
        style={{ background: "var(--surface)" }}
      >
        <div className="store-container">
          <FadeUp className="max-w-2xl mx-auto text-center">
            <h2 className="section-title mb-4">
              No te pierdas nada
            </h2>
            <p className="section-subtitle mx-auto mb-8">
              Siguenos en redes sociales para enterarte de ofertas exclusivas y nuevos lanzamientos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/catalogo"
                className="btn-primary"
              >
                Explorar Catalogo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              {tenant.phone && (
                <a
                  href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

/* ── Skeleton Loader ── */
function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl p-4"
          style={{ background: "var(--surface-solid)" }}
        >
          <div 
            className="aspect-square rounded-xl mb-4 skeleton-shimmer"
            style={{ background: "var(--surface)" }}
          />
          <div 
            className="h-3 rounded w-3/4 mb-2 skeleton-shimmer"
            style={{ background: "var(--surface)" }}
          />
          <div 
            className="h-4 rounded w-1/2 skeleton-shimmer"
            style={{ background: "var(--surface)" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
