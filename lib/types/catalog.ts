import type { PaginationMeta } from "./api";

export interface Game {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  is_active: boolean;
  formats?: GameFormat[];
}

export interface GameFormat {
  id: string;
  name: string;
  slug: string;
  game_id: string;
  description?: string;
  is_active: boolean;
}

export interface CardColor {
  code: string;
  name: string;
}

export interface CardSet {
  id: string;
  name: string;
  code: string;
  released_at?: string;
  icon_url?: string;
  set_type?: string;
}

export interface CardPrinting {
  id: string;
  card_id: string;
  set_id: string;
  set_name: string;
  set_code: string;
  collector_number: string;
  rarity: string;
  image_url?: string;
  back_image_url?: string;
  image_uris?: Record<string, string>;
  released_at?: string;
  price_usd?: number;
  price_usd_foil?: number;
  price_clp?: number;
}

export interface PriceHistoryEntry {
  date: string;
  price_usd?: number;
  price_usd_foil?: number;
  price_clp?: number;
  source: string;
}

export interface CardLegalityEntry {
  format_slug: string;
  format_name: string;
  status: "legal" | "not_legal" | "banned" | "restricted";
}

export interface Card {
  id: string;
  name: string;
  slug?: string;
  oracle_text?: string;
  flavor_text?: string;
  type_line?: string;
  mana_cost?: string;
  cmc?: number;
  power?: string;
  toughness?: string;
  loyalty?: string;
  colors?: string[];
  color_identity?: string[];
  keywords?: string[];
  rarity?: string;
  artist?: string;
  image_url?: string;
  back_image_url?: string;
  game_id: string;
  game_name: string;
  game_slug: string;
  latest_printing?: CardPrinting;
  price_usd?: number;
  price_clp?: number;
  created_at?: string;
}

export interface CardSearchParams {
  q?: string;
  game?: string;
  set?: string;
  rarity?: string;
  type_line?: string;
  colors?: string;
  format?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface CardSearchResponse {
  cards: Card[];
  meta: PaginationMeta;
}

export interface CardAutocompleteResponse {
  suggestions: string[];
}

export interface CardDetail extends Card {
  printings?: CardPrinting[];
  legalities?: CardLegalityEntry[];
  price_history?: PriceHistoryEntry[];
}

export interface CardPrintingsResponse {
  printings: CardPrinting[];
}

export interface CardPriceHistoryResponse {
  history: PriceHistoryEntry[];
}

export interface CardLegalityResponse {
  legalities: CardLegalityEntry[];
}

export interface GameListResponse {
  games: Game[];
}

export interface GameFormatsResponse {
  formats: GameFormat[];
}
