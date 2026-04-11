"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts, addCartItem } from "@/lib/api/store";
import type { Product } from "@/lib/types/store";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "@heroui/react";

import ImageCarousel from "@/components/ui/ImageCarousel";
import ProductCarousel from "@/components/ui/ProductCarousel";
import CategoryTile from "@/components/ui/CategoryTile";
import { FadeUp, Stagger, StaggerChild } from "@/lib/motion";

export default function HomeClient() {
  const tenant = useTenant();
  const increment = useCartStore((s) => s.increment);

  const carousel = tenant.config?.carousel_slides || tenant.config?.carousel_images || [];
  const tiles = tenant.config?.category_tiles || [];
  const sections = tenant.config?.home_sections;
  const whatsappNum = tenant.config?.whatsapp_number ?? tenant.phone;

  const { data: featuredData } = useQuery({
    queryKey: ["products-featured", tenant.slug],
    queryFn: () => getTenantProducts(tenant.slug, { sort: "popular", per_page: 14 }),
  });

  const { data: newData } = useQuery({
    queryKey: ["products-new", tenant.slug],
    queryFn: () => getTenantProducts(tenant.slug, { sort: "recent", per_page: 14 }),
  });

  const { data: saleData } = useQuery({
    queryKey: ["products-sale", tenant.slug],
    queryFn: () => getTenantProducts(tenant.slug, { on_sale: "true", per_page: 14 }),
  });

  const featured = featuredData?.products ?? [];
  const newProducts = newData?.products ?? [];
  const saleProducts = saleData?.products ?? [];

  async function handleAddToCart(p: Product) {
    try {
      await addCartItem(tenant.slug, p.id);
      increment();
      toast.success("Producto agregado al carrito");
    } catch {
      toast.danger("Inicia sesion para agregar al carrito");
    }
  }

  return (
    <div>
      {/* Hero Carousel */}
      {carousel.length > 0 && (
        <ImageCarousel slides={carousel} />
      )}

      {/* Category Tiles */}
      {tiles.length > 0 && (
        <section className="apple-section">
          <div className="store-container">
            <FadeUp className="text-center mb-14">
              <h2 className="section-title">{sections?.categories?.title ?? "Explora por categoria"}</h2>
              <p className="section-subtitle mx-auto mt-3">
                {sections?.categories?.subtitle ?? "Encuentra lo que buscas facilmente"}
              </p>
            </FadeUp>

            <Stagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {tiles.map((tile, i) => (
                  <StaggerChild key={i}>
                    <CategoryTile tile={tile} />
                  </StaggerChild>
                ))}
              </div>
            </Stagger>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="apple-section" style={{ background: "var(--surface-solid)" }}>
          <div className="store-container">
            <ProductCarousel
              title={sections?.featured?.title ?? "Los mas populares"}
              subtitle={sections?.featured?.subtitle ?? "Los productos favoritos de nuestros clientes"}
              products={featured}
              onAddToCart={handleAddToCart}
              viewAllLink="/catalogo?sort=popular"
            />
          </div>
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="apple-section">
          <div className="store-container">
            <ProductCarousel
              title={sections?.sale?.title ?? "Ofertas destacadas"}
              subtitle={sections?.sale?.subtitle ?? "Los mejores descuentos que no te puedes perder"}
              products={saleProducts}
              onAddToCart={handleAddToCart}
              viewAllLink="/catalogo?on_sale=true"
            />
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="apple-section" style={{ background: "var(--surface-solid)" }}>
          <div className="store-container">
            <ProductCarousel
              title={sections?.new_arrivals?.title ?? "Recien llegados"}
              subtitle={sections?.new_arrivals?.subtitle ?? "Lo ultimo que agregamos a nuestro catalogo"}
              products={newProducts}
              onAddToCart={handleAddToCart}
              viewAllLink="/catalogo?sort=recent"
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="apple-section">
        <div className="store-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="section-title mb-4">
              {sections?.cta?.title ?? "¿No encuentras lo que buscas?"}
            </h2>
            <p className="section-subtitle mx-auto mb-8">
              {sections?.cta?.subtitle ?? "Explora nuestro catalogo completo o contactanos para pedidos especiales"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/catalogo" className="btn-primary">
                {sections?.cta?.catalog_button ?? "Ver catalogo completo"}
              </a>
              {whatsappNum && (
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {sections?.cta?.whatsapp_button ?? "Contactar por WhatsApp"}
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
