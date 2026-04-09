export type TournamentStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "OPEN"
  | "CHECK_IN"
  | "STARTED"
  | "ROUND_IN_PROGRESS"
  | "ROUND_COMPLETE"
  | "FINISHED"
  | "CLOSED"
  | "CANCELLED";

export interface TournamentListItem {
  id: string; // PublicID
  name: string;
  slug: string;
  banner_url?: string;
  logo_url?: string;
  origin: string;
  status: TournamentStatus;
  visibility: string;
  modality: string;
  format_type: string;
  tier: string;
  is_ranked: boolean;
  is_qualifier: boolean;
  current_players: number;
  max_players?: number;
  city?: string;
  country_code?: string;
  starts_at: string;
  ends_at?: string;
  entry_fee: number;
  currency: string;
  prize_pool: number;
  game_name: string;
  game_slug: string;
  format_name: string;
  organizer_name: string;
  tenant_logo_url?: string;
  game_logo_url?: string;
  distance_km?: number;
}

export interface PrizeDistribution {
  position_from: number;
  position_to: number;
  prize_type: string;
  amount?: number;
  percentage?: number;
  description?: string;
}

export interface Judge {
  user_id: string;
  username: string;
  is_head_judge: boolean;
  assigned_at: string;
}

export interface Registration {
  status: string;
  seed?: number;
  final_position?: number;
  match_points: number;
  game_wins: number;
  game_losses: number;
  game_draws: number;
  omw_pct?: number;
  ogw_pct?: number;
  gwp_pct?: number;
  paid_at?: string;
  checked_in_at?: string;
  dropped_at?: string;
  drop_round?: number;
  registered_at: string;
}

export interface Round {
  round_number: number;
  is_top_cut: boolean;
  status: string;
  timer_minutes?: number;
  started_at?: string;
  ended_at?: string;
  time_extended: number;
  created_at: string;
}

export interface TournamentDetail extends Omit<TournamentListItem, "distance_km"> {
  description?: string;
  rules?: string;
  best_of: number;
  max_rounds?: number;
  round_timer_min: number;
  check_in_minutes?: number;
  allow_self_report: boolean;
  min_players: number;
  current_round: number;
  venue_name?: string;
  address?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  registration_opens_at?: string;
  registration_closes_at?: string;
  platform_fee_pct: number;
  sponsor_name?: string;
  sponsor_logo_url?: string;
  sponsor_url?: string;
  inscription_url?: string;
  contact_info?: Record<string, any>;
  metadata?: Record<string, any>;
  
  format_slug: string;
  user_role: string;
  is_following: boolean;
  followers_count: number;
  judges: Judge[];
  rounds: Round[];
  my_registration?: Registration;
  prizes: PrizeDistribution[];
  qualifier_tournaments: TournamentListItem[];
  parent_tournaments: TournamentListItem[];
}

export interface TournamentListFilters {
  status?: string;
  game?: string;
  format?: string;
  origin?: string;
  is_ranked?: boolean;
  tier?: string;
  modality?: string;
  city?: string;
  near_lat?: number;
  near_lng?: number;
  radius?: number;
  tenant_id?: number;
  organizer_id?: number;
  date_from?: string;
  date_to?: string;
  has_entry_fee?: boolean;
  min_entry_fee?: number;
  max_entry_fee?: number;
  q?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}
