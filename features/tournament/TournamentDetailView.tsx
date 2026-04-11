"use client";

import { TournamentDetail } from "@/lib/types/tournament";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, MapPin, Users, Trophy, DollarSign, ExternalLink, ShieldAlert, List, Swords } from "lucide-react";
import { formatCLP } from "./TournamentCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  registerForTournament,
  unregisterFromTournament,
  checkInToTournament,
  followTournament,
  unfollowTournament,
} from "@/lib/api/tournament";
import { toast } from "@heroui/react";
import Link from "next/link";

interface Props {
  tournament: TournamentDetail;
}

export default function TournamentDetailView({ tournament }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const authenticated = isAuthenticated();

  const startDate = new Date(tournament.starts_at);
  const isUpcoming = startDate > new Date();
  const isOpen = tournament.status === "OPEN";
  const isCheckIn = tournament.status === "CHECK_IN";
  const myReg = tournament.my_registration;
  const isRegistered = !!myReg && myReg.status !== "DROPPED";
  const isCheckedIn = !!myReg?.checked_in_at;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["tournament", tournament.id] });
  }

  const registerMut = useMutation({
    mutationFn: () => registerForTournament(tournament.id),
    onSuccess: () => { toast.success("¡Inscripción exitosa!"); invalidate(); },
  });

  const unregisterMut = useMutation({
    mutationFn: () => unregisterFromTournament(tournament.id),
    onSuccess: () => { toast.success("Inscripción cancelada."); invalidate(); },
  });

  const checkInMut = useMutation({
    mutationFn: () => checkInToTournament(tournament.id),
    onSuccess: () => { toast.success("¡Check-in realizado!"); invalidate(); },
  });

  const followMut = useMutation({
    mutationFn: () => tournament.is_following ? unfollowTournament(tournament.id) : followTournament(tournament.id),
    onSuccess: () => invalidate(),
  });

  function handleRegistrationAction() {
    if (!authenticated) {
      router.push(`/login?redirect=/torneos/${tournament.id}`);
      return;
    }
    if (isCheckIn && isRegistered && !isCheckedIn) {
      checkInMut.mutate();
    } else if (isRegistered) {
      unregisterMut.mutate();
    } else if (isOpen) {
      registerMut.mutate();
    }
  }

  const isMutating = registerMut.isPending || unregisterMut.isPending || checkInMut.isPending;

  function getButtonLabel(): string {
    if (isMutating) return "...";
    if (!authenticated) return "Inicia sesión para inscribirte";
    if (isCheckIn && isRegistered && !isCheckedIn) return "Hacer Check-in";
    if (isCheckIn && isCheckedIn) return "Check-in realizado ✓";
    if (isRegistered) return "Cancelar inscripción";
    if (isOpen) return "Inscribirse Ahora";
    return "Inscripciones Cerradas";
  }

  const buttonDisabled =
    isMutating ||
    (!isOpen && !isCheckIn) ||
    (isCheckIn && isCheckedIn);

  const buttonDanger = isRegistered && !isCheckIn;

  return (
    <div className="store-container py-8 relative">
      <Breadcrumb items={[
        { label: "Inicio", href: "/" },
        { label: "Torneos", href: "/torneos" },
        { label: tournament.name },
      ]} />

      {/* Banner */}
      <div className="w-full relative aspect-[21/9] md:aspect-[3/1] rounded-card overflow-hidden mb-8 border border-border"
        style={{ background: "var(--muted)" }}>
        {tournament.banner_url ? (
          <img src={tournament.banner_url} alt={tournament.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(to right, var(--background), var(--muted))" }}>
            <Trophy className="w-24 h-24" style={{ color: "color-mix(in srgb, var(--muted) 20%, transparent)" }} />
          </div>
        )}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--background) 0%, color-mix(in srgb, var(--background) 40%, transparent) 50%, transparent 100%)" }} />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-start gap-4">
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-bold rounded-lg backdrop-blur-md ${isUpcoming ? "bg-green-500/80 text-white" : "bg-foreground/50 text-background"}`}>
              {tournament.status}
            </span>
            {tournament.is_ranked && (
              <span className="px-3 py-1 text-sm font-bold rounded-lg backdrop-blur-md bg-purple-500/80 text-white shadow-sm shadow-purple-500/20">
                Ranked
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md" style={{ color: "var(--foreground)" }}>
            {tournament.name}
          </h1>
          <div className="flex items-center gap-3 text-sm md:text-base font-medium" style={{ color: "color-mix(in srgb, var(--foreground) 80%, transparent)" }}>
            {tournament.game_logo_url && (
              <img src={tournament.game_logo_url} className="w-6 h-6 rounded-full" alt="Game" />
            )}
            <span>{tournament.game_name}</span>
            <span className="opacity-50">•</span>
            <span>{tournament.format_name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="surface-card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[var(--store-primary)]" />
              Detalles del Torneo
            </h2>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "color-mix(in srgb, var(--foreground) 80%, transparent)" }}>
              {tournament.description || "No hay descripción disponible para este torneo."}
            </div>
          </div>

          {(tournament.rules || tournament.prizes.length > 0) && (
            <div className="surface-card p-6 md:p-8">
              {tournament.rules && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-3">Reglas</h3>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "color-mix(in srgb, var(--foreground) 80%, transparent)" }}>
                    {tournament.rules}
                  </div>
                </div>
              )}
              {tournament.prizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Premios
                  </h3>
                  <div className="space-y-3">
                    {tournament.prizes.map((prize, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg border text-sm"
                        style={{ background: "color-mix(in srgb, var(--background) 50%, transparent)", borderColor: "color-mix(in srgb, var(--border) 50%, transparent)" }}>
                        <span className="font-bold text-[var(--store-primary)]">
                          {prize.position_from === prize.position_to
                            ? `Puesto ${prize.position_from}`
                            : `Top ${prize.position_from} - ${prize.position_to}`}
                        </span>
                        <div className="text-right">
                          <span className="block capitalize font-medium" style={{ color: "var(--foreground)" }}>{prize.prize_type}</span>
                          {prize.description && <span className="block text-xs text-muted">{prize.description}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick links to sub-pages */}
          {(tournament.status === "STARTED" || tournament.status === "ROUND_IN_PROGRESS" || tournament.status === "ROUND_COMPLETE" || tournament.status === "FINISHED") && (
            <div className="surface-card p-6">
              <h3 className="text-lg font-bold mb-4">Información del torneo</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/torneos/${tournament.id}/standings`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <List className="w-4 h-4" />
                  Ver standings
                </Link>
                <Link
                  href={`/torneos/${tournament.id}/rondas`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <Swords className="w-4 h-4" />
                  Ver rondas
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="surface-card p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-muted shrink-0" />
                <div className="flex flex-col text-sm">
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>Fecha y Hora</span>
                  <span className="capitalize text-muted">{format(startDate, "EEEE dd MMMM, yyyy", { locale: es })}</span>
                  <span className="text-muted">{format(startDate, "HH:mm")} hrs</span>
                </div>
              </div>

              {tournament.modality !== "ONLINE" && (
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-muted shrink-0" />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                      Ubicación {tournament.venue_name && `(${tournament.venue_name})`}
                    </span>
                    <span className="text-muted">
                      {tournament.address ?? ""}
                      {tournament.city ? `, ${tournament.city}` : ""}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Users className="w-5 h-5 text-muted shrink-0" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>Jugadores:</span>
                  <span className="text-muted">
                    {tournament.current_players} {tournament.max_players ? `/ ${tournament.max_players}` : "inscritos"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <DollarSign className="w-5 h-5 text-muted shrink-0" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>Inscripción:</span>
                  <span className="font-bold text-[var(--store-primary)] text-lg">
                    {tournament.entry_fee > 0 ? formatCLP(tournament.entry_fee) : "Gratis"}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {tournament.inscription_url ? (
              <a
                href={tournament.inscription_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform"
              >
                Inscribirse Externamente <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={handleRegistrationAction}
                disabled={buttonDisabled}
                className="w-full py-3 rounded-lg font-bold flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
                style={{
                  background: buttonDanger
                    ? "color-mix(in srgb, var(--danger) 10%, transparent)"
                    : "var(--store-primary)",
                  color: buttonDanger ? "var(--danger)" : "white",
                  border: buttonDanger ? "1.5px solid var(--danger)" : "none",
                }}
              >
                {getButtonLabel()}
              </button>
            )}

            {/* Follow button */}
            {authenticated && (
              <button
                onClick={() => followMut.mutate()}
                disabled={followMut.isPending}
                className="w-full py-2.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {tournament.is_following ? "✓ Siguiendo" : "Seguir torneo"}
                {tournament.followers_count > 0 && (
                  <span className="ml-1 text-xs opacity-60">({tournament.followers_count})</span>
                )}
              </button>
            )}
          </div>

          {tournament.organizer_name && (
            <div className="text-center text-sm text-muted p-4">
              Organizado por <span className="font-bold" style={{ color: "var(--foreground)" }}>{tournament.organizer_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
