import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTenant } from "@/lib/api/tenant";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import JsonLd from "@/components/seo/JsonLd";
import TerminosContent from "@/features/static/TerminosContent";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tenant = await getTenant(slug);
    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    return {
      title: `Terminos de Uso | ${tenant.name}`,
      description: `Terminos y condiciones de uso de ${tenant.name}.`,
      alternates: {
        canonical: `${baseUrl}/terminos`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return { title: "Terminos de Uso" };
  }
}

export default async function TerminosPage() {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  let breadcrumbJsonLd = null;
  try {
    const tenant = await getTenant(slug);
    breadcrumbJsonLd = buildBreadcrumbJsonLd(
      [
        { name: "Inicio", url: "/" },
        { name: "Terminos de Uso", url: "/terminos" },
      ],
      tenant
    );
  } catch {
    // degrade gracefully
  }

  return (
    <>
      {breadcrumbJsonLd && <JsonLd data={breadcrumbJsonLd} />}
      <TerminosContent />
    </>
  );
}
