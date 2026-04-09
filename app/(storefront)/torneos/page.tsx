import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTenant } from "@/lib/api/tenant";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import JsonLd from "@/components/seo/JsonLd";
import TournamentList from "@/features/tournament/TournamentList";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tenant = await getTenant(slug);
    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    return {
      title: `Torneos | ${tenant.name}`,
      description: `Participa en los torneos y eventos oficiales de ${tenant.name}. Revisa las reglas, premios e inscríbete para jugar con la comunidad.`,
      alternates: {
        canonical: `${baseUrl}/torneos`,
      },
    };
  } catch {
    return { title: "Torneos" };
  }
}

export default async function TorneosPage() {
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  let breadcrumbJsonLd = null;
  try {
    const tenant = await getTenant(slug);
    breadcrumbJsonLd = buildBreadcrumbJsonLd(
      [
        { name: "Inicio", url: "/" },
        { name: "Torneos", url: "/torneos" },
      ],
      tenant
    );
  } catch {
    // degrade gracefully
  }

  return (
    <>
      {breadcrumbJsonLd && <JsonLd data={breadcrumbJsonLd} />}
      <TournamentList />
    </>
  );
}
