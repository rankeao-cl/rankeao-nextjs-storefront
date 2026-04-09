"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { getTenantProducts, addCartItem } from "@/lib/api/store";
import type { Product } from "@/lib/types/store";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "@heroui/react";
import Image from "next/image";

import ImageCarousel from "@/components/ui/ImageCarousel";
import CalabozoProductCarousel from "../components/CalabozoProductCarousel";

// Ensure this matches the Tenant type prop expected by the dispatcher
export function HomePage({ tenant: serverTenant }: { tenant?: any }) {
  // If the server didn't pass it, we fallback to the context
  const contextTenant = useTenant();
  const tenant = serverTenant || contextTenant;
  const increment = useCartStore((s) => s.increment);

  const carousel = tenant?.config?.carousel_slides || tenant?.config?.carousel_images || [];

  const { data: featuredData } = useQuery({
    queryKey: ["products-featured", tenant?.slug],
    queryFn: () => getTenantProducts(tenant?.slug, { sort: "popular", per_page: 14 }),
    enabled: !!tenant?.slug
  });

  const { data: newData } = useQuery({
    queryKey: ["products-new", tenant?.slug],
    queryFn: () => getTenantProducts(tenant?.slug, { sort: "recent", per_page: 14 }),
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
      toast.danger("Ocurrió un error");
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Carousel */}
      {carousel.length > 0 && (
        <div className="w-full">
            <ImageCarousel slides={carousel} heightClass="h-[300px] md:h-[480px]" />
        </div>
      )}

      {/* Benefits Bar - Image provided by customer */}
      <div className="w-full bg-[#ebebeb] py-5 px-4 md:px-5">
        <div className="max-w-[1140px] mx-auto text-center">
            <Image 
              src="/calabozo/post-footer.png" 
              alt="Beneficios Calabozo" 
              width={1140} 
              height={150} 
              className="w-full h-auto object-contain mx-auto"
              priority
            />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-8 bg-[#f9f9f9]">
          <div className="container mx-auto">
            {/* Featured Products */}
            {featured.length > 0 && (
              <CalabozoProductCarousel
                title="Destacados"
                products={featured}
                onAddToCart={handleAddToCart}
                viewAllLink="/catalogo?sort=popular"
              />
            )}

            {/* New Products */}
            {newProducts.length > 0 && (
              <CalabozoProductCarousel
                title="Nuevos Arribos"
                products={newProducts}
                onAddToCart={handleAddToCart}
                viewAllLink="/catalogo?sort=recent"
              />
            )}
          </div>
      </div>
    </div>
  );
}
