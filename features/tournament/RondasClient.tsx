"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRoundMatches } from "@/lib/api/tournament";
import type { Round, Match } from "@/lib/types/tournament";

const ROUND_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En curso",
  COMPLETE: "Completada",
  FINISHED: "Finalizada",
};

function MatchRow({ match }: { match: Match }) {
  const isP1Winner = match.winner_id === match.player1_id;
  const isP2Winner = match.winner_id === match.player2_id;

  return (
    <div
      className="flex items-center justify-between px-4 py-3 text-sm"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {/* Table number */}
      {match.table_number && (
        <span className="w-8 text-xs text-muted shrink-0">#{match.table_number}</span>
      )}

      {/* Player 1 */}
      <span
        className={`flex-1 font-medium truncate ${isP1Winner ? "font-bold" : ""}`}
        style={{ color: isP1Winner ? "var(--success)" : "var(--foreground)" }}
      >
        {match.player1_name}
      </span>

      {/* Score */}
      <div className="mx-3 flex items-center gap-1.5 shrink-0">
        {match.is_bye ? (
          <span className="text-xs px-2 py-0.5 rounded-full text-muted" style={{ background: "color-mix(in srgb, var(--muted) 10%, transparent)" }}>
            BYE
          </span>
        ) : match.status === "PENDING" ? (
          <span className="text-xs text-muted">vs</span>
        ) : (
          <>
            <span
              className="text-base font-bold w-5 text-center"
              style={{ color: isP1Winner ? "var(--success)" : "var(--muted)" }}
            >
              {match.player1_wins}
            </span>
            <span className="text-muted text-xs">—</span>
            <span
              className="text-base font-bold w-5 text-center"
              style={{ color: isP2Winner ? "var(--success)" : "var(--muted)" }}
            >
              {match.player2_wins}
            </span>
          </>
        )}
      </div>

      {/* Player 2 */}
      <span
        className={`flex-1 font-medium text-right truncate ${isP2Winner ? "font-bold" : ""}`}
        style={{ color: isP2Winner ? "var(--success)" : match.is_bye ? "var(--muted)" : "var(--foreground)" }}
      >
        {match.is_bye ? "BYE" : match.player2_name ?? "TBD"}
      </span>
    </div>
  );
}

interface Props {
  tournamentId: string;
  rounds: Round[];
}

export default function RondasClient({ tournamentId, rounds }: Props) {
  const latestRound = rounds.reduce(
    (best, r) => (r.round_number > (best?.round_number ?? 0) ? r : best),
    rounds[0]
  );
  const [selectedRound, setSelectedRound] = useState(latestRound?.round_number ?? 1);

  const { data, isLoading } = useQuery({
    queryKey: ["round-matches", tournamentId, selectedRound],
    queryFn: () => getRoundMatches(tournamentId, selectedRound),
    enabled: rounds.length > 0,
  });

  const matches = data?.matches ?? [];

  if (rounds.length === 0) {
    return (
      <div className="surface-card rounded-card p-16 text-center">
        <p className="text-muted">Las rondas estarán disponibles cuando el torneo comience.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Round Tabs */}
      <div className="surface-card rounded-card p-4">
        <div className="flex flex-wrap gap-2">
          {rounds.map((round) => {
            const isActive = round.round_number === selectedRound;
            const statusColor =
              round.status === "IN_PROGRESS" || round.status === "STARTED"
                ? "var(--store-primary)"
                : round.status === "COMPLETE" || round.status === "FINISHED"
                ? "var(--success)"
                : "var(--muted)";

            return (
              <button
                key={round.round_number}
                onClick={() => setSelectedRound(round.round_number)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: isActive
                    ? "var(--store-primary)"
                    : "color-mix(in srgb, var(--foreground) 5%, transparent)",
                  color: isActive ? "white" : "var(--foreground)",
                  border: isActive
                    ? "none"
                    : `1px solid var(--border)`,
                }}
              >
                Ronda {round.round_number}
                {(round.status === "IN_PROGRESS" || round.status === "STARTED") && (
                  <span
                    className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: statusColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matches */}
      <div className="surface-card rounded-card overflow-hidden">
        {/* Round header */}
        {(() => {
          const round = rounds.find((r) => r.round_number === selectedRound);
          return round ? (
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: "var(--surface-solid-secondary)" }}
            >
              <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Ronda {round.round_number}
                {round.is_top_cut && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--store-primary) 15%, transparent)", color: "var(--store-primary)" }}>
                    Top Cut
                  </span>
                )}
              </span>
              <span className="text-xs text-muted">
                {ROUND_STATUS_LABEL[round.status] ?? round.status}
              </span>
            </div>
          ) : null;
        })()}

        {isLoading ? (
          <div className="p-8 text-center text-muted text-sm">Cargando partidas...</div>
        ) : matches.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">No hay partidas disponibles para esta ronda.</div>
        ) : (
          <div>
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted"
              style={{ background: "var(--surface-solid-secondary)", borderTop: "1px solid var(--border)" }}
            >
              {matches[0]?.table_number && <span className="w-8">Mesa</span>}
              <span className="flex-1">Jugador 1</span>
              <span className="mx-3 shrink-0">Resultado</span>
              <span className="flex-1 text-right">Jugador 2</span>
            </div>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
