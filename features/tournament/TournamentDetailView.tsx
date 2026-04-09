"use client";

import { TournamentDetail } from "@/lib/types/tournament";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, MapPin, Users, Trophy, DollarSign, ExternalLink, ShieldAlert } from "lucide-react";
import { formatCLP } from "./TournamentCard";

interface Props {
  tournament: TournamentDetail;
}

export default function TournamentDetailView({ tournament }: Props) {
  const startDate = new Date(tournament.starts_at);
  const isUpcoming = startDate > new Date();

  return (
    <div className="store-container py-8 relative">
      {/* Banner */}
      <div className="w-full relative aspect-[21/9] md:aspect-[3/1] bg-muted rounded-card overflow-hidden mb-8 border border-border">
        {tournament.banner_url ? (
          <img src={tournament.banner_url} alt={tournament.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-background to-muted flex items-center justify-center">
            <Trophy className="w-24 h-24 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
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
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight drop-shadow-md">
            {tournament.name}
          </h1>
          <div className="flex items-center gap-3 text-sm md:text-base text-foreground/80 font-medium">
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
        {/* Main Content Info */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="surface-card p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[var(--store-primary)]" />
              Detalles del Torneo
            </h2>
            <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-wrap">
              {tournament.description || "No hay descripción disponible para este torneo."}
            </div>
          </div>

          {(tournament.rules || tournament.prizes.length > 0) && (
            <div className="surface-card p-6 md:p-8">
              {tournament.rules && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-3">Reglas</h3>
                  <div className="text-sm text-foreground/80 whitespace-pre-wrap">{tournament.rules}</div>
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
                      <div key={idx} className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border/50 text-sm">
                        <span className="font-bold text-[var(--store-primary)]">
                          {prize.position_from === prize.position_to 
                            ? `Puesto ${prize.position_from}`
                            : `Top ${prize.position_from} - ${prize.position_to}`}
                        </span>
                        <div className="text-right">
                          <span className="block text-foreground capitalize font-medium">{prize.prize_type}</span>
                          {prize.description && <span className="block text-xs text-muted-foreground">{prize.description}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="surface-card p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col text-sm">
                  <span className="font-semibold text-foreground">Fecha y Hora</span>
                  <span className="capitalize text-muted-foreground">{format(startDate, "EEEE dd MMMM, yyyy", { locale: es })}</span>
                  <span className="text-muted-foreground">{format(startDate, "HH:mm")} hrs</span>
                </div>
              </div>

              {tournament.modality !== "ONLINE" && (
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-foreground">
                      Ubicación {tournament.venue_name && `(${tournament.venue_name})`}
                    </span>
                    <span className="text-muted-foreground">
                      {tournament.address ? tournament.address : ""}
                      {tournament.city ? `, ${tournament.city}` : ""}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">Jugadores:</span>
                  <span className="text-muted-foreground">
                    {tournament.current_players} {tournament.max_players ? `/ ${tournament.max_players}` : "inscritos"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">Inscripción:</span>
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
                disabled={!isUpcoming || tournament.status !== "OPEN"}
                className="w-full btn-primary py-3 rounded-lg font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 transition-transform"
              >
                {tournament.status === "OPEN" ? "Inscribirse Ahora" : "Inscripciones Cerradas"}
              </button>
            )}
          </div>
          
          {tournament.organizer_name && (
            <div className="text-center text-sm text-muted-foreground p-4">
              Organizado por <span className="font-bold text-foreground">{tournament.organizer_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
