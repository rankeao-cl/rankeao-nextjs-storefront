import { apiFetch, apiPost, apiPatch, apiDelete } from "./client";
import type { ProductsResponse, Product, Cart, StoreOrder, StoreCheckoutRequest, ProductCategory } from "@/lib/types/store";
import type { Params, ApiResponse, ApiMessage, PaginationMeta } from "@/lib/types/api";

// ── Products ──

export async function getTenantProducts(tenantSlug: string, params?: Params): Promise<ProductsResponse> {
  const res = await apiFetch<{ data?: Product[]; products?: Product[]; meta?: PaginationMeta }>(`/store/${encodeURIComponent(tenantSlug)}/products`, params, { revalidate: 30 });
  return {
    products: res.data ?? res.products ?? [],
    meta: res.meta,
  };
}

export async function getProductDetail(productId: string) {
  return apiFetch<ApiResponse<{ product: Product }>>(`/store/products/${encodeURIComponent(productId)}`);
}

// ── Categories ──

export async function getCategories() {
  return apiFetch<ApiResponse<{ categories: ProductCategory[] }>>("/store/categories", undefined, { revalidate: 300 });
}

// ── Cart ──

export async function getCart(tenantSlug: string) {
  return apiFetch<ApiResponse<Cart>>(`/store/${encodeURIComponent(tenantSlug)}/cart`, undefined, { cache: "no-store" });
}

export async function addCartItem(tenantSlug: string, productId: string, quantity: number = 1, variantId?: string) {
  return apiPost<ApiResponse<Cart>>(`/store/${encodeURIComponent(tenantSlug)}/cart/items`, {
    product_id: productId,
    quantity,
    ...(variantId ? { variant_id: variantId } : {}),
  });
}

export async function updateCartItem(tenantSlug: string, itemId: string, quantity: number) {
  return apiPatch<ApiResponse<Cart>>(`/store/${encodeURIComponent(tenantSlug)}/cart/items/${itemId}`, { quantity });
}

export async function removeCartItem(tenantSlug: string, itemId: string) {
  return apiDelete<ApiResponse<ApiMessage>>(`/store/${encodeURIComponent(tenantSlug)}/cart/items/${itemId}`);
}

export async function clearCart(tenantSlug: string) {
  return apiDelete<ApiResponse<ApiMessage>>(`/store/${encodeURIComponent(tenantSlug)}/cart`);
}

// ── Coupons ──

export async function applyCoupon(tenantSlug: string, code: string) {
  return apiPost<ApiResponse<Cart>>(`/store/${encodeURIComponent(tenantSlug)}/cart/coupon`, { code });
}

export async function removeCoupon(tenantSlug: string) {
  return apiDelete<ApiResponse<ApiMessage>>(`/store/${encodeURIComponent(tenantSlug)}/cart/coupon`);
}

// ── Checkout ──

export async function createCheckout(tenantSlug: string, payload: StoreCheckoutRequest) {
  return apiPost<ApiResponse<{ order: StoreOrder }>>(`/store/${encodeURIComponent(tenantSlug)}/checkout`, payload);
}

// ── Orders ──

export async function getMyOrders(params?: Params) {
  return apiFetch<ApiResponse<{ orders: StoreOrder[] }>>("/store/orders", params, { cache: "no-store" });
}

export async function getOrder(orderId: string) {
  return apiFetch<ApiResponse<{ order: StoreOrder }>>(`/store/orders/${encodeURIComponent(orderId)}`, undefined, { cache: "no-store" });
}

export async function getOrderByTracking(tenantSlug: string, orderNumber: string) {
  return apiFetch<ApiResponse<{ order: StoreOrder }>>(`/store/${encodeURIComponent(tenantSlug)}/orders/track`, { order_number: orderNumber }, { cache: "no-store" });
}
