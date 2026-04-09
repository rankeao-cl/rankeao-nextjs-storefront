import type { Metadata } from "next";
import { getTournamentById } from "@/lib/api/tournament";
import { getTenant } from "@/lib/api/tenant";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import TournamentDetailView from "@/features/tournament/TournamentDetailView";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tournament = await getTournamentById(id, { revalidate: 60 });
    const tenant = await getTenant(slug);
    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    return {
      title: `${tournament.name} | ${tenant.name}`,
      description: tournament.description?.slice(0, 160) || `Torneo ${tournament.name} de ${tournament.game_name}. Inscríbete ahora.`,
      alternates: {
        canonical: `${baseUrl}/torneos/${tournament.id}`,
      },
      openGraph: {
        images: tournament.banner_url ? [{ url: tournament.banner_url }] : undefined,
      }
    };
  } catch {
    return { title: "Torneo" };
  }
}

export default async function TournamentDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const tournament = await getTournamentById(id, { revalidate: 60 });
    let breadcrumbJsonLd = null;

    try {
      const tenant = await getTenant(slug);
      breadcrumbJsonLd = buildBreadcrumbJsonLd(
        [
          { name: "Inicio", url: "/" },
          { name: "Torneos", url: "/torneos" },
          { name: tournament.name, url: `/torneos/${tournament.id}` },
        ],
        tenant
      );
    } catch {
      // degrade gracefully
    }

    return (
      <>
        {breadcrumbJsonLd && <JsonLd data={breadcrumbJsonLd} />}
        <TournamentDetailView tournament={tournament} />
      </>
    );
  } catch (error: any) {
    if (error?.status === 404) notFound();
    throw error;
  }
}
