import type { MetadataRoute } from "next";

/**
 * Dynamic robots.txt for the multi-tenant storefront.
 *
 * Since each tenant runs on a subdomain (calabozo.rankeao.cl),
 * we allow indexing of public content and block private/API routes.
 * The sitemap URL is resolved dynamically per-host at crawl time
 * because Next.js serves the same app across all subdomains.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || "rankeao.cl";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/registro",
          "/checkout",
          "/carrito",
          "/pedidos",
          "/perfil",
          "/admin/",
          "/_next/",
        ],
      },
      {
        // Block aggressive crawlers that waste crawl budget
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"],
        disallow: "/",
      },
    ],
    // Each tenant subdomain will need its own sitemap.
    // The wildcard here tells Google about the default.
    sitemap: `https://${baseUrl}/sitemap.xml`,
  };
}
