export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status?: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  address?: string;
  postal_code?: string;
  logo_url?: string;
  banner_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  custom_domain?: string;
  is_public?: boolean;
  description?: string;
  short_description?: string;
  email?: string;
  phone?: string;
  website?: string;
  plan?: string;
  timezone?: string;
  currency?: string;
  avg_rating?: number;
  review_count?: number;
  follower_count?: number;
  product_count?: number;
  is_open_now?: boolean;
  is_verified?: boolean;
  social_links?: TenantSocialLink[];
  schedules?: TenantSchedule[];
  tags?: string[];
  config?: TenantStorefrontConfig;
  created_at?: string;
  updated_at?: string;
}

export interface TenantSocialLink {
  platform: string;
  url: string;
}

export interface TenantSchedule {
  day?: string;
  day_of_week?: string;
  open_time?: string;
  close_time?: string;
  opens_at?: string;
  closes_at?: string;
  is_closed?: boolean;
}

export interface TenantHomeSections {
  categories?: { title?: string; subtitle?: string };
  featured?: { title?: string; subtitle?: string };
  sale?: { title?: string; subtitle?: string };
  new_arrivals?: { title?: string; subtitle?: string };
  cta?: {
    title?: string;
    subtitle?: string;
    catalog_button?: string;
    whatsapp_button?: string;
  };
}

export interface TenantStorefrontConfig {
  carousel_images?: CarouselSlide[];
  carousel_slides?: CarouselSlide[];
  category_tiles?: CategoryTile[];
  community_images?: CategoryTile[];
  menu_items?: TenantMenuItem[];
  home_sections?: TenantHomeSections;
  whatsapp_number?: string;
  contact_email?: string;
  google_maps_url?: string;
  payment_methods_image?: string;
  footer_logo_url?: string;
  about_html?: string;
  terms_html?: string;
  promo_bar_text?: string;
  social_links?: { instagram?: string; tiktok?: string; facebook?: string };
  operating_schedules?: { days: string; hours: string }[];
}

export interface TenantMenuSubItem {
  name: string;
  href: string;
}

export interface TenantMegaColumn {
  title: string;
  items: TenantMenuSubItem[];
}

export interface TenantMenuItem {
  label: string;
  href: string;
  type: "mega" | "dropdown" | "link";
  columns?: TenantMegaColumn[];
  items?: TenantMenuSubItem[];
}

export interface CarouselSlide {
  image_url: string;
  link_url?: string;
  link_text?: string;
  alt_text?: string;
  title?: string;
  subtitle?: string;
}

export interface CategoryTile {
  image_url: string;
  link_url?: string;
  title?: string;
}
