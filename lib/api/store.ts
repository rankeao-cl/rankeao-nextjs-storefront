import { apiFetch, apiPost, apiPatch, apiDelete } from "./client";
import type {
  ProductsResponse,
  Product,
  Cart,
  StoreOrder,
  StoreCheckoutRequest,
  ProductCategory,
} from "@/lib/types/store";
import type {
  Params,
  ApiResponse,
  ApiMessage,
  PaginationMeta,
} from "@/lib/types/api";

type ProductWithNestedFields = Product & {
  category?: {
    id?: string;
    slug?: string;
    name?: string;
  };
  game?: {
    id?: string;
    name?: string;
  };
};

type ProductListEnvelope = {
  data?: Product[];
  products?: Product[];
  meta?: PaginationMeta;
};

type CartItemWithLegacyFields = Cart["items"][number] & {
  product_name?: string;
  unit_price?: number;
  max_stock?: number;
};

type CartWithLegacyFields = Omit<Cart, "items"> & {
  items?: CartItemWithLegacyFields[];
};

function hasEmbeddedProduct(
  value: unknown,
): value is { product: ProductWithNestedFields } {
  return typeof value === "object" && value !== null && "product" in value;
}

function normalizeProductDetail(product: ProductWithNestedFields): Product {
  const compareAtPrice = product.compare_at_price ?? product.compare_price;

  return {
    ...product,
    compare_at_price: compareAtPrice,
    category_id: product.category_id ?? product.category?.id,
    category_name: product.category_name ?? product.category?.name,
    category_slug: product.category_slug ?? product.category?.slug,
    game_id: product.game_id ?? product.game?.id,
    game_name: product.game_name ?? product.game?.name,
  };
}

function normalizeProductList(products: Product[]): Product[] {
  return products.map((product) =>
    normalizeProductDetail(product as ProductWithNestedFields),
  );
}

function hasEmbeddedCart(
  value: unknown,
): value is { cart: CartWithLegacyFields } {
  return typeof value === "object" && value !== null && "cart" in value;
}

function normalizeCartPayload(cart: CartWithLegacyFields): Cart {
  const items = (cart.items ?? []).map((item) => ({
    ...item,
    name: item.name ?? item.product_name ?? "",
    price: item.price ?? item.unit_price ?? 0,
    stock: item.stock ?? item.max_stock,
  }));

  return {
    ...cart,
    items,
    subtotal: cart.subtotal ?? 0,
    discount: cart.discount ?? 0,
    total: cart.total ?? 0,
  };
}

// ── Products ──

export async function getTenantProducts(
  tenantSlug: string,
  params?: Params,
): Promise<ProductsResponse> {
  const normalizedParams: Params = { ...(params ?? {}) };

  if (
    normalizedParams.category !== undefined &&
    normalizedParams.category_id === undefined
  ) {
    normalizedParams.category_id = normalizedParams.category;
  }

  if (normalizedParams.sort === "recent") {
    normalizedParams.sort = "newest";
  }

  const onSaleRequested =
    normalizedParams.on_sale === true || normalizedParams.on_sale === "true";

  delete normalizedParams.category;
  delete normalizedParams.on_sale;

  const res = await apiFetch<{
    data?: Product[] | ProductListEnvelope;
    products?: Product[];
    meta?: PaginationMeta;
  }>(`/store/${encodeURIComponent(tenantSlug)}/products`, normalizedParams, {
    revalidate: 30,
  });

  const nested =
    res.data && !Array.isArray(res.data)
      ? (res.data as ProductListEnvelope)
      : undefined;
  const products = Array.isArray(res.data)
    ? res.data
    : (nested?.data ?? nested?.products ?? res.products ?? []);

  let normalizedProducts = normalizeProductList(products);
  if (onSaleRequested) {
    normalizedProducts = normalizedProducts.filter((product) => {
      const comparePrice = product.compare_at_price ?? product.compare_price;
      return (
        typeof comparePrice === "number" && comparePrice > (product.price ?? 0)
      );
    });
  }

  return {
    products: normalizedProducts,
    meta: onSaleRequested ? undefined : (res.meta ?? nested?.meta),
  };
}

export async function getProductDetail(productId: string): Promise<{
  success?: boolean;
  data?: Product;
  meta?: PaginationMeta;
  message?: string;
}> {
  const res = await apiFetch<
    ApiResponse<ProductWithNestedFields | { product: ProductWithNestedFields }>
  >(`/store/products/${encodeURIComponent(productId)}`);

  const rawProduct = hasEmbeddedProduct(res.data) ? res.data.product : res.data;
  const product = rawProduct ? normalizeProductDetail(rawProduct) : undefined;

  return {
    ...res,
    data: product,
  };
}

// ── Categories ──

export async function getCategories() {
  return apiFetch<ApiResponse<{ categories: ProductCategory[] }>>(
    "/store/categories",
    undefined,
    { revalidate: 300 },
  );
}

// ── Cart ──

export async function getCart(tenantSlug: string) {
  const res = await apiFetch<
    ApiResponse<CartWithLegacyFields | { cart: CartWithLegacyFields }>
  >(`/store/${encodeURIComponent(tenantSlug)}/cart`, undefined, {
    cache: "no-store",
  });

  const rawCart = hasEmbeddedCart(res.data) ? res.data.cart : res.data;

  return {
    ...res,
    data: rawCart ? normalizeCartPayload(rawCart) : undefined,
  };
}

export async function addCartItem(
  tenantSlug: string,
  productId: string,
  quantity: number = 1,
  variantId?: string,
) {
  return apiPost<ApiResponse<Cart>>(
    `/store/${encodeURIComponent(tenantSlug)}/cart/items`,
    {
      product_id: productId,
      quantity,
      ...(variantId ? { variant_id: variantId } : {}),
    },
  );
}

export async function updateCartItem(
  tenantSlug: string,
  itemId: string,
  quantity: number,
) {
  return apiPatch<ApiResponse<Cart>>(
    `/store/${encodeURIComponent(tenantSlug)}/cart/items/${itemId}`,
    { quantity },
  );
}

export async function removeCartItem(tenantSlug: string, itemId: string) {
  return apiDelete<ApiResponse<ApiMessage>>(
    `/store/${encodeURIComponent(tenantSlug)}/cart/items/${itemId}`,
  );
}

export async function clearCart(tenantSlug: string) {
  return apiDelete<ApiResponse<ApiMessage>>(
    `/store/${encodeURIComponent(tenantSlug)}/cart`,
  );
}

// ── Coupons ──

export async function applyCoupon(tenantSlug: string, code: string) {
  return apiPost<ApiResponse<Cart>>(
    `/store/${encodeURIComponent(tenantSlug)}/cart/coupon`,
    { code },
  );
}

export async function removeCoupon(tenantSlug: string) {
  return apiDelete<ApiResponse<ApiMessage>>(
    `/store/${encodeURIComponent(tenantSlug)}/cart/coupon`,
  );
}

// ── Checkout ──

export async function createCheckout(
  tenantSlug: string,
  payload: StoreCheckoutRequest,
) {
  return apiPost<ApiResponse<{ order: StoreOrder }>>(
    `/store/${encodeURIComponent(tenantSlug)}/checkout`,
    payload,
  );
}

// ── Orders ──

export async function getMyOrders(params?: Params) {
  return apiFetch<ApiResponse<{ orders: StoreOrder[] }>>(
    "/store/orders",
    params,
    { cache: "no-store" },
  );
}

export async function getOrder(orderId: string) {
  return apiFetch<ApiResponse<{ order: StoreOrder }>>(
    `/store/orders/${encodeURIComponent(orderId)}`,
    undefined,
    { cache: "no-store" },
  );
}

export async function getOrderByTracking(
  tenantSlug: string,
  orderNumber: string,
) {
  return apiFetch<ApiResponse<{ order: StoreOrder }>>(
    `/store/${encodeURIComponent(tenantSlug)}/orders/track`,
    { order_number: orderNumber },
    { cache: "no-store" },
  );
}
