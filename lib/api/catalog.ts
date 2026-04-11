import { apiFetch } from "./client";
import type {
  Card,
  CardDetail,
  CardSearchParams,
  CardSearchResponse,
  CardAutocompleteResponse,
  CardPrintingsResponse,
  CardPriceHistoryResponse,
  CardLegalityResponse,
  Game,
  GameListResponse,
  GameFormatsResponse,
} from "@/lib/types/catalog";
import type { Params } from "@/lib/types/api";

// ── Cards ──

export async function searchCards(params: CardSearchParams = {}): Promise<CardSearchResponse> {
  return apiFetch<CardSearchResponse>("/catalog/cards/search", params as Params, { revalidate: 60 });
}

export async function autocompleteCards(q: string): Promise<CardAutocompleteResponse> {
  return apiFetch<CardAutocompleteResponse>(
    "/catalog/cards/autocomplete",
    { q },
    { revalidate: 30 }
  );
}

export async function getCard(cardId: string): Promise<CardDetail> {
  const res = await apiFetch<{ card: CardDetail }>(
    `/catalog/cards/${encodeURIComponent(cardId)}`,
    undefined,
    { revalidate: 300 }
  );
  return res.card;
}

export async function getCardPrintings(cardId: string): Promise<CardPrintingsResponse> {
  return apiFetch<CardPrintingsResponse>(
    `/catalog/cards/${encodeURIComponent(cardId)}/printings`,
    undefined,
    { revalidate: 300 }
  );
}

export async function getCardPriceHistory(cardId: string): Promise<CardPriceHistoryResponse> {
  return apiFetch<CardPriceHistoryResponse>(
    `/catalog/cards/${encodeURIComponent(cardId)}/price-history`,
    undefined,
    { revalidate: 60 }
  );
}

export async function getCardLegality(cardId: string): Promise<CardLegalityResponse> {
  return apiFetch<CardLegalityResponse>(
    `/catalog/cards/${encodeURIComponent(cardId)}/legality`,
    undefined,
    { revalidate: 300 }
  );
}

// ── Games ──

export async function getGames(): Promise<GameListResponse> {
  return apiFetch<GameListResponse>("/catalog/games", undefined, { revalidate: 600 });
}

export async function getGame(slug: string): Promise<Game> {
  const res = await apiFetch<{ game: Game }>(
    `/catalog/games/${encodeURIComponent(slug)}`,
    undefined,
    { revalidate: 600 }
  );
  return res.game;
}

export async function getGameFormats(slug: string): Promise<GameFormatsResponse> {
  return apiFetch<GameFormatsResponse>(
    `/catalog/games/${encodeURIComponent(slug)}/formats`,
    undefined,
    { revalidate: 600 }
  );
}
