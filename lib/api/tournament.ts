import { apiFetch, apiPost, apiDelete } from "./client";
import type { PaginationMeta } from "@/lib/types/api";
import type {
  TournamentListItem,
  TournamentDetail,
  TournamentListFilters,
  Match,
  Standing,
  BracketNode,
  Registration,
  RegistrationResult,
  Round,
} from "@/lib/types/tournament";

export async function getTournaments(
  filters: TournamentListFilters = {},
  options?: { cache?: RequestCache; revalidate?: number; token?: string }
): Promise<{ data: TournamentListItem[]; meta: PaginationMeta }> {
  // Convert standard types to query params string representation
  const queryParams: Record<string, string | number | boolean | undefined> = { ...filters };
  
  const endpoint = "/tournaments";
  const res = await apiFetch<{ tournaments: TournamentListItem[]; meta: PaginationMeta }>(
    endpoint,
    queryParams,
    options
  );

  return {
    data: res.tournaments,
    meta: res.meta,
  };
}

export async function getTournamentById(
  idOrSlug: string,
  options?: { cache?: RequestCache; revalidate?: number; token?: string }
): Promise<TournamentDetail> {
  const res = await apiFetch<{ tournament: TournamentDetail }>(
    `/tournaments/${idOrSlug}`,
    undefined,
    options
  );
  return res.tournament;
}

export async function getTournamentRegistrations(
  tournamentId: string,
  params?: { page?: number; per_page?: number }
): Promise<{ registrations: Array<Registration & { user_id: string; username: string }>; meta: PaginationMeta }> {
  return apiFetch(`/tournaments/${tournamentId}/registrations`, params, { revalidate: 30 });
}

export async function getTournamentRounds(tournamentId: string): Promise<{ rounds: Round[] }> {
  return apiFetch(`/tournaments/${tournamentId}/rounds`, undefined, { revalidate: 15 });
}

export async function getRoundMatches(
  tournamentId: string,
  roundNumber: number
): Promise<{ matches: Match[] }> {
  return apiFetch(`/tournaments/${tournamentId}/rounds/${roundNumber}/matches`, undefined, { revalidate: 15 });
}

export async function getTournamentStandings(tournamentId: string): Promise<{ standings: Standing[] }> {
  return apiFetch(`/tournaments/${tournamentId}/standings`, undefined, { revalidate: 15 });
}

export async function getTournamentBracket(tournamentId: string): Promise<{ bracket: BracketNode[] }> {
  return apiFetch(`/tournaments/${tournamentId}/bracket`, undefined, { revalidate: 15 });
}

export async function getMyMatches(tournamentId: string): Promise<{ matches: Match[] }> {
  return apiFetch(`/tournaments/${tournamentId}/my-matches`, undefined, { cache: "no-store" });
}

export async function registerForTournament(
  tournamentId: string,
  payload?: Record<string, unknown>
): Promise<RegistrationResult> {
  return apiPost(`/tournaments/${tournamentId}/register`, payload ?? {});
}

export async function unregisterFromTournament(tournamentId: string): Promise<{ message?: string }> {
  return apiDelete(`/tournaments/${tournamentId}/register`);
}

export async function checkInToTournament(tournamentId: string): Promise<{ message?: string }> {
  return apiPost(`/tournaments/${tournamentId}/check-in`, {});
}

export async function followTournament(tournamentId: string): Promise<{ message?: string }> {
  return apiPost(`/tournaments/${tournamentId}/follow`, {});
}

export async function unfollowTournament(tournamentId: string): Promise<{ message?: string }> {
  return apiDelete(`/tournaments/${tournamentId}/follow`);
}
