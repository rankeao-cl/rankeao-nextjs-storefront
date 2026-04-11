import type { Metadata } from "next";
import { getTournamentById, getTournamentStandings } from "@/lib/api/tournament";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const tournament = await getTournamentById(id, { revalidate: 60 });
    return { title: `Standings — ${tournament.name}` };
  } catch {
    return { title: "Standings" };
  }
}

export default async function StandingsPage({ params }: Props) {
  const { id } = await params;

  let tournament;
  let standings;

  try {
    [tournament, standings] = await Promise.all([
      getTournamentById(id, { revalidate: 30 }),
      getTournamentStandings(id),
    ]);
  } catch (error: unknown) {
    if ((error as { status?: number })?.status === 404) notFound();
    throw error;
  }

  const rows = standings?.standings ?? [];

  return (
    <div className="store-container py-8">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Torneos", href: "/torneos" },
        { label: tournament.name, href: `/torneos/${id}` },
        { label: "Standings" },
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
          <h1 className="section-title leading-none">Standings</h1>
          <p className="text-muted text-sm mt-1">{tournament.name}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="surface-card rounded-card p-16 text-center">
          <p className="text-muted">Los standings estarán disponibles cuando el torneo comience.</p>
        </div>
      ) : (
        <div className="surface-card rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface-solid-secondary)" }}>
                  <th className="text-left px-4 py-3 font-semibold text-muted w-12">#</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>Jugador</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted">Pts</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted hidden sm:table-cell">GW%</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted hidden md:table-cell">OMW%</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted hidden md:table-cell">Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((standing, i) => (
                  <tr
                    key={standing.user_id}
                    style={{
                      borderTop: "1px solid var(--border)",
                      background: i % 2 === 0 ? "transparent" : "color-mix(in srgb, var(--surface) 40%, transparent)",
                    }}
                  >
                    <td className="px-4 py-3 font-bold" style={{ color: i < 3 ? "var(--store-primary)" : "var(--muted)" }}>
                      {standing.position}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                      {standing.username}
                    </td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: "var(--foreground)" }}>
                      {standing.match_points}
                    </td>
                    <td className="px-4 py-3 text-right text-muted hidden sm:table-cell">
                      {(standing.gwp_pct * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right text-muted hidden md:table-cell">
                      {(standing.omw_pct * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      {standing.dropped ? (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>
                          Retirado
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" }}>
                          Activo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs text-muted border-t border-border">
            Pts = puntos de match · GW% = porcentaje victorias de juego · OMW% = OMW tiebreaker
          </div>
        </div>
      )}
    </div>
  );
}
