import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTenant } from "@/lib/api/tenant";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import JsonLd from "@/components/seo/JsonLd";
import { themeRegistry } from "@/themes/registry";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tenant = await getTenant(slug);
    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    return {
      title: `Sobre nosotros | ${tenant.name}`,
      description:
        tenant.description?.slice(0, 160) ||
        `Conoce mas sobre ${tenant.name}. ${tenant.city ? `Ubicados en ${tenant.city}, Chile.` : ""}`,
      alternates: {
        canonical: `${baseUrl}/nosotros`,
      },
    };
  } catch {
    return { title: "Sobre nosotros" };
  }
}

export default async function NosotrosPage() {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  let tenant = null;
  let breadcrumbJsonLd = null;
  try {
    tenant = await getTenant(slug);
    breadcrumbJsonLd = buildBreadcrumbJsonLd(
      [
        { name: "Inicio", url: "/" },
        { name: "Sobre nosotros", url: "/nosotros" },
      ],
      tenant
    );
  } catch {
    // degrade gracefully
  }

  // Find the exact Theme Nosotros Page
  const ThemeNosotrosPage = themeRegistry[slug]?.pages?.NosotrosPage || themeRegistry.default.pages.NosotrosPage;

  return (
    <>
      {breadcrumbJsonLd && <JsonLd data={breadcrumbJsonLd} />}
      <ThemeNosotrosPage tenant={tenant} />
    </>
  );
}
