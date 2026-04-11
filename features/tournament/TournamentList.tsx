"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { getTournaments } from "@/lib/api/tournament";
import TournamentCard from "./TournamentCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { TournamentGridSkeleton } from "@/components/skeletons/TournamentCardSkeleton";

export default function TournamentList() {
  const tenant = useTenant();
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["tournaments", tenant.id, statusFilter],
    queryFn: () => getTournaments({
      tenant_id: tenant.id ? Number(tenant.id) : undefined,
      status: statusFilter || undefined,
      per_page: 50
    }),
    enabled: !!tenant.id
  });

  const tournaments = data?.data || [];

  return (
    <div className="store-container py-12">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Torneos" },
      ]} />

      <div className="text-center mb-12">
        <h1 className="section-title mb-4">Torneos y Eventos</h1>
        <p className="section-subtitle mx-auto">
          Participa en los torneos oficiales y eventos organizados por {tenant.name}.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          {statusFilter === "OPEN" ? "Inscripciones Abiertas"
            : statusFilter === "FINISHED" ? "Resultados Anteriores"
            : "Próximos Torneos"}
        </h2>

        <div className="flex p-1 rounded-lg" style={{ background: "color-mix(in srgb, var(--muted) 20%, transparent)" }}>
          {(["", "OPEN", "FINISHED"] as const).map((value, i) => {
            const labels = ["Todos", "Abiertos", "Pasados"];
            const isActive = statusFilter === value;
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "shadow"
                    : "hover:opacity-80"
                }`}
                style={{
                  background: isActive ? "var(--surface-solid)" : "transparent",
                  color: isActive ? "var(--foreground)" : "var(--muted)",
                }}
              >
                {labels[i]}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <TournamentGridSkeleton count={3} />
      ) : error ? (
        <div className="surface-card p-12 text-center">
          <p className="font-medium mb-2" style={{ color: "var(--danger)" }}>Error al cargar los torneos</p>
          <p className="text-muted text-sm">Por favor intenta de nuevo más tarde.</p>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="surface-card p-16 text-center flex flex-col items-center">
          <svg className="w-16 h-16 mb-4" style={{ color: "color-mix(in srgb, var(--muted) 30%, transparent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">No hay torneos {statusFilter ? "con este filtro" : "disponibles"}</h3>
          <p className="text-muted text-sm">
            {tenant.name} aún no ha publicado torneos. Vuelve pronto para enterarte de próximos eventos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}
