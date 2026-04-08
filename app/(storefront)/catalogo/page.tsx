import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getTenant } from "@/lib/api/tenant";
import CatalogClient from "@/features/catalog/CatalogClient";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";

/**
 * Dynamic metadata for the catalog page.
 *
 * SEO critical decision: the canonical URL for /catalogo always points
 * to the clean URL without query parameters. This prevents Google from
 * indexing hundreds of filter/sort/page combinations as separate pages,
 * which would cause massive duplicate content and crawl budget waste.
 */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tenant = await getTenant(slug);
    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    return {
      title: `Catalogo | ${tenant.name}`,
      description: `Explora el catalogo completo de ${tenant.name}. Encuentra los mejores productos con envio a todo Chile.`,
      alternates: {
        canonical: `${baseUrl}/catalogo`,
      },
      openGraph: {
        title: `Catalogo | ${tenant.name}`,
        description: `Explora el catalogo completo de ${tenant.name}.`,
        url: `${baseUrl}/catalogo`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Catalogo",
    };
  }
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="store-container py-8"><ProductGridSkeleton count={12} /></div>}>
      <CatalogClient />
    </Suspense>
  );
}
