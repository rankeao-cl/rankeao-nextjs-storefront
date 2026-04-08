import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { getTenant } from "@/lib/api/tenant";
import { buildOrganizationJsonLd, buildLocalBusinessJsonLd, buildWebSiteJsonLd } from "@/lib/seo/json-ld";
import JsonLd from "@/components/seo/JsonLd";
import type { Tenant } from "@/lib/types/tenant";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tenant = await getTenant(slug);
    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    return {
      metadataBase: new URL(baseUrl),
      title: { default: tenant.name, template: `%s | ${tenant.name}` },
      description: tenant.short_description || tenant.description || "",
      icons: tenant.favicon_url ? { icon: tenant.favicon_url } : undefined,
      alternates: {
        canonical: "/",
      },
      openGraph: {
        title: tenant.name,
        description: tenant.short_description || "",
        type: "website",
        locale: "es_CL",
        siteName: tenant.name,
        images: tenant.banner_url ? [{ url: tenant.banner_url, width: 1200, height: 630 }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: tenant.name,
        description: tenant.short_description || "",
        images: tenant.banner_url ? [tenant.banner_url] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        // Add your Google Search Console verification code here per tenant
        // google: tenant.config?.google_verification || undefined,
      },
    };
  } catch {
    return { title: "Tienda" };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  let tenant: Tenant;
  try {
    tenant = await getTenant(slug);
  } catch {
    tenant = {
      id: "0",
      name: "Tienda",
      slug,
      primary_color: "#C52828",
      secondary_color: "#ffffff",
    };
  }

  // Determine which org schema to use:
  // - If the tenant has a physical address, use LocalBusiness (Store) for richer SERP features
  // - Otherwise, fall back to Organization
  const hasPhysicalPresence = Boolean(tenant.address || tenant.city);
  const orgJsonLd = hasPhysicalPresence
    ? buildLocalBusinessJsonLd(tenant)
    : buildOrganizationJsonLd(tenant);
  const websiteJsonLd = buildWebSiteJsonLd(tenant);

  const primaryColor = tenant.primary_color || "#C52828";
  const secondaryColor = tenant.secondary_color || "#ffffff";
  console.log("[v0] Tenant colors:", { slug: tenant.slug, primaryColor: tenant.primary_color, resolved: primaryColor });

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://api.rankeao.cl" />
        <link rel="preconnect" href="https://api.rankeao.cl" crossOrigin="anonymous" />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root, .dark, [data-theme="dark"] { --store-primary: ${primaryColor}; --store-secondary: ${secondaryColor}; }`,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} antialiased min-h-screen flex flex-col`}
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <JsonLd data={orgJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--store-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          Saltar al contenido principal
        </a>
        <Providers tenant={tenant}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
