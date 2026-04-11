import type { Metadata } from "next";
import { getTournamentById, getTournamentRounds } from "@/lib/api/tournament";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RondasClient from "@/features/tournament/RondasClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const tournament = await getTournamentById(id, { revalidate: 60 });
    return { title: `Rondas — ${tournament.name}` };
  } catch {
    return { title: "Rondas" };
  }
}

export default async function RondasPage({ params }: Props) {
  const { id } = await params;

  let tournament;
  let roundsData;

  try {
    [tournament, roundsData] = await Promise.all([
      getTournamentById(id, { revalidate: 30 }),
      getTournamentRounds(id),
    ]);
  } catch (error: unknown) {
    if ((error as { status?: number })?.status === 404) notFound();
    throw error;
  }

  const rounds = roundsData?.rounds ?? [];

  return (
    <div className="store-container py-8">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Torneos", href: "/torneos" },
        { label: tournament.name, href: `/torneos/${id}` },
        { label: "Rondas" },
      ]} />

      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/torneos/${id}`}
          className="p-2 rounded-lg border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="section-title leading-none">Rondas</h1>
          <p className="text-muted text-sm mt-1">{tournament.name}</p>
        </div>
      </div>

      <RondasClient tournamentId={id} rounds={rounds} />
    </div>
  );
}
