import type { PaginationMeta } from "./api";

export interface Product {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  short_description?: string;
  price?: number;
  compare_at_price?: number;
  compare_price?: number;
  currency?: string;
  card_condition?: string;
  is_foil?: boolean;
  game_id?: string;
  game_name?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  tenant_id?: string;
  tenant_name?: string;
  tenant_slug?: string;
  tenant_city?: string;
  tenant_region?: string;
  image_url?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  related_products?: Product[];
  tags?: string[];
  city?: string;
  region?: string;
  stock?: number;
  in_stock?: boolean;
  is_active?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id?: number;
  url: string;
  alt_text?: string;
  sort_order?: number;
  is_primary?: boolean;
}

export interface ProductVariant {
  /** Backend int64 — arrives as JSON number. Use String(id) only for React keys. */
  id: number;
  name: string;
  /** Price difference from the base product price (can be negative). Add to product.price to get final variant price. */
  price_diff?: number;
  stock?: number;
  sku?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  meta?: PaginationMeta;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  parent_id?: string;
  children?: ProductCategory[];
}

/** Matches backend Cart DTO. */
export interface Cart {
  tenant_slug: string;
  items: CartItem[];
  item_count?: number;
  subtotal: number;
  discount: number;
  total: number;
  currency?: string;
  coupon?: AppliedCoupon;
  warnings?: CartWarning[];
}

/**
 * Matches backend CartItem DTO.
 * NOTE: `price` is a normalized alias of the backend field `unit_price`,
 * mapped by the API layer (normalizeCartPayload). Use `price` everywhere in UI.
 */
export interface CartItem {
  /** Backend int64 — arrives as JSON number; coerced to string in URL paths automatically. */
  id: number;
  product_id: string;
  /** Backend *int64 optional. Must be sent as number to backend. */
  variant_id?: number;
  /** Normalized from backend `product_name` by API layer. */
  name: string;
  image_url?: string;
  /** Normalized from backend `unit_price` by API layer. */
  price: number;
  /** Raw unit_price from backend (kept for completeness). */
  unit_price?: number;
  total?: number;
  quantity: number;
  in_stock?: boolean;
  /** Normalized from backend `max_stock` by API layer. */
  stock?: number;
  max_stock?: number;
}

export interface AppliedCoupon {
  code: string;
  discount_amount: number;
  discount_type: string;
}

export interface CartWarning {
  type: "PRICE_CHANGED" | "OUT_OF_STOCK" | "LOW_STOCK" | "PRODUCT_UNAVAILABLE";
  /** Backend int64 — arrives as JSON number. */
  item_id: number;
  message: string;
}

/** Matches backend CheckoutRequest DTO exactly. */
export interface StoreCheckoutRequest {
  delivery_method: "SHIPPING" | "PICKUP" | "IN_PERSON";
  payment_method: "WEBPAY" | "MERCADOPAGO" | "TRANSFER";
  buyer_notes?: string;
  meetup_location?: string;
  meetup_date?: string;
  shipping_address?: {
    name: string;
    phone: string;
    /** Maps to backend ShippingAddress.Address (required when delivery_method=SHIPPING). */
    address: string;
    city: string;
    region: string;
    postal_code?: string;
    country: string;
  };
}

/**
 * Buyer-facing order. Covers both OrderListItem (abbreviated) and Order / OrderDetail.
 * Fields present only in the detail view are marked optional.
 * `items` is only populated in the detail view, not in the list.
 */
export interface StoreOrder {
  id: string;
  order_number: string;
  order_type?: string;
  status: string;
  /** Only present in full Order/OrderDetail — not in OrderListItem. */
  subtotal?: number;
  discount: number;
  shipping_cost?: number;
  total: number;
  currency?: string;
  delivery_method?: string;
  delivery_notes?: string;
  item_summary?: string;
  buyer_notes?: string;
  tenant_name?: string;
  coupon_code?: string;
  coupon_discount?: number;
  created_at?: string;
  updated_at?: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  // Detail-only sub-resources
  items?: StoreOrderItem[];
  shipment?: StoreShipmentInfo;
}

export interface StoreOrderItem {
  id?: number;
  product_id: string;
  product_name: string;
  product_sku?: string;
  product_image_url?: string;
  variant_id?: number;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface StoreShipmentInfo {
  id?: string;
  carrier: string;
  carrier_name?: string;
  tracking_number?: string;
  tracking_url?: string;
  status?: string;
  estimated_delivery?: string;
  in_transit_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  notes?: string;
}
