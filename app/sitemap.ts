import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import { getTenant } from "@/lib/api/tenant";
import { getTenantProducts } from "@/lib/api/store";

/**
 * Dynamic sitemap generated per-tenant.
 *
 * Because the middleware injects the tenant slug via cookie based on the
 * subdomain, each subdomain (calabozo.rankeao.cl, tienda2.rankeao.cl)
 * will generate its own sitemap with the correct URLs.
 *
 * For large catalogs (1000+ products), consider implementing
 * generateSitemaps() to split into multiple sitemap files.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  let baseUrl: string;
  try {
    const tenant = await getTenant(slug);
    baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;
  } catch {
    baseUrl = `https://${slug}.rankeao.cl`;
  }

  // Static pages -- high priority, low change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Product pages -- fetched from API
  let productPages: MetadataRoute.Sitemap = [];
  try {
    // Fetch all products; paginate if your API supports it
    const data = await getTenantProducts(slug, { per_page: 1000 });
    const products = data?.products ?? [];

    productPages = products
      .filter((p) => p.is_active !== false)
      .map((product) => ({
        url: `${baseUrl}/producto/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // If product fetch fails, return static pages only
    console.error("[sitemap] Failed to fetch products for tenant:", slug);
  }

  return [...staticPages, ...productPages];
}
