import { apiFetch } from "./client";
import { PaginationMeta } from "@/lib/types/api";
import { TournamentListItem, TournamentDetail, TournamentListFilters } from "@/lib/types/tournament";

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
