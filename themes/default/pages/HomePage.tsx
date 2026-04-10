"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts, addCartItem } from "@/lib/api/store";
import type { Product } from "@/lib/types/store";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import type { Tenant } from "@/lib/types/tenant";

import ImageCarousel from "@/components/ui/ImageCarousel";
import ProductCard from "@/components/ui/ProductCard";

export function HomePage({ tenant: serverTenant }: { tenant?: Tenant }) {
  const contextTenant = useTenant();
  const tenant = serverTenant || contextTenant;
  const increment = useCartStore((s) => s.increment);

  const carousel = tenant?.config?.carousel_slides || tenant?.config?.carousel_images || [];

  const { data: featuredData } = useQuery({
    queryKey: ["products-featured", tenant?.slug],
    queryFn: () => getTenantProducts(tenant?.slug, { sort: "popular", per_page: 12 }),
    enabled: !!tenant?.slug
  });

  const { data: newData } = useQuery({
    queryKey: ["products-new", tenant?.slug],
    queryFn: () => getTenantProducts(tenant?.slug, { sort: "recent", per_page: 12 }),
    enabled: !!tenant?.slug
  });

  const featured = featuredData?.products ?? [];
  const newProducts = newData?.products ?? [];

  async function handleAddToCart(p: Product) {
    if (!tenant?.slug) return;
    try {
      await addCartItem(tenant.slug, p.id);
      increment();
      toast.success("Agregado al carrito!");
    } catch {
      toast.danger("Inicia sesión para agregar al carrito");
    }
  }

  return (
    <div className="bg-[#111111] min-h-screen">
      {/* Hero Carousel */}
      {carousel.length > 0 && (
        <ImageCarousel slides={carousel} />
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Los Más Populares
                </h2>
                <p className="text-sm text-white/40 mt-1">
                  Los productos favoritos de nuestros clientes
                </p>
              </div>
              <Link 
                href="/catalogo?sort=popular" 
                className="hidden md:inline-flex text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {featured.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link href="/catalogo?sort=popular" className="text-sm font-semibold text-violet-400">
                Ver todos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Recién Llegados
                </h2>
                <p className="text-sm text-white/40 mt-1">
                  Lo último que agregamos al catálogo
                </p>
              </div>
              <Link 
                href="/catalogo?sort=recent" 
                className="hidden md:inline-flex text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {newProducts.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link href="/catalogo?sort=recent" className="text-sm font-semibold text-violet-400">
                Ver todos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-cyan-500/20 border border-white/5 p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto mb-8">
                Explora nuestro catálogo completo o contáctanos para pedidos especiales
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link 
                  href="/catalogo" 
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-blue-400 transition-all shadow-lg shadow-violet-500/25"
                >
                  Ver catálogo completo
                </Link>
                {tenant?.phone && (
                  <a
                    href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all"
                  >
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
