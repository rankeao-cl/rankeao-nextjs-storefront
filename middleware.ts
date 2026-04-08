import { NextRequest, NextResponse } from "next/server";

const STOREFRONT_DOMAIN = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || "rankeao.cl";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const response = NextResponse.next();

  // Extract tenant slug from subdomain: calabozo.rankeao.cl → "calabozo"
  let tenantSlug = "";

  if (hostname.endsWith(`.${STOREFRONT_DOMAIN}`)) {
    tenantSlug = hostname.replace(`.${STOREFRONT_DOMAIN}`, "").split(":")[0];
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Dev: use query param or default to rankeao (main storefront)
    tenantSlug = request.nextUrl.searchParams.get("tenant") || "rankeao";
  } else {
    // Custom domain: resolve via header or fallback
    tenantSlug = request.nextUrl.searchParams.get("tenant") || "";
  }

  if (tenantSlug) {
    response.headers.set("x-tenant-slug", tenantSlug);
    // Make slug available to server components via cookie
    response.cookies.set("tenant-slug", tenantSlug, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
