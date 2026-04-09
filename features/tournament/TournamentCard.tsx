import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TournamentListItem } from "@/lib/types/tournament";

interface Props {
  tournament: TournamentListItem;
}

export function formatCLP(amount: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(amount);
}

export default function TournamentCard({ tournament }: Props) {
  const startDate = new Date(tournament.starts_at);
  const isUpcoming = startDate > new Date();

  return (
    <div className="surface-card rounded-card overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-border/50 group">
      {/* Banner / Poster */}
      <Link href={`/torneos/${tournament.id}`} className="block relative aspect-video bg-muted overflow-hidden">
        {tournament.banner_url ? (
          <img
            src={tournament.banner_url}
            alt={tournament.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted text-center">
            <span className="text-muted-foreground font-semibold text-lg">{tournament.game_name}</span>
            <span className="text-xs text-muted-foreground/70 uppercase tracking-widest">{tournament.format_name}</span>
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-md backdrop-blur-md ${
            isUpcoming ? "bg-green-500/80 text-white" : "bg-foreground/50 text-background"
          }`}>
            {tournament.status}
          </span>
          {tournament.is_ranked && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-md backdrop-blur-md bg-purple-500/80 text-white shadow-sm shadow-purple-500/20">
              Ranked
            </span>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex gap-2 items-center mb-2">
          {tournament.game_logo_url && (
            <img src={tournament.game_logo_url} alt={tournament.game_name} className="w-5 h-5 rounded-full object-cover" />
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {tournament.game_name}
          </span>
          <span className="w-1 h-1 rounded-full bg-border"></span>
          <span className="text-xs text-muted-foreground/80">{tournament.format_name}</span>
        </div>

        <Link href={`/torneos/${tournament.id}`} className="block mb-4">
          <h3 className="text-xl font-bold leading-tight line-clamp-2 text-foreground group-hover:text-[var(--store-primary)] transition-colors">
            {tournament.name}
          </h3>
        </Link>
        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-foreground/80">
            <svg className="w-4 h-4 mr-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="capitalize">{format(startDate, "EEEE dd MMMM, HH:mm", { locale: es })}</span>
          </div>

          <div className="flex items-center text-sm text-foreground/80">
            <svg className="w-4 h-4 mr-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{tournament.modality === 'IN_PERSON' ? (tournament.city || 'Presencial') : (tournament.modality === 'ONLINE' ? 'Online' : 'Híbrido')}</span>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Inscripción</span>
              <span className="font-bold text-foreground">
                {tournament.entry_fee > 0 ? formatCLP(tournament.entry_fee) : "Gratis"}
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Jugadores</span>
              <span className="font-medium text-foreground">
                {tournament.current_players} {tournament.max_players ? `/ ${tournament.max_players}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
