import { NextRequest, NextResponse } from "next/server";

const STOREFRONT_DOMAIN = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || "rankeao.cl";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  let tenantSlug = "";

  const isRootDomain =
    hostname === STOREFRONT_DOMAIN ||
    hostname === `www.${STOREFRONT_DOMAIN}` ||
    (hostname.includes("localhost") && !request.nextUrl.searchParams.has("tenant") && !request.cookies.has("tenant-slug"));

  if (isRootDomain) {
    tenantSlug = "__directory__";
  } else if (hostname.endsWith(`.${STOREFRONT_DOMAIN}`)) {
    tenantSlug = hostname.replace(`.${STOREFRONT_DOMAIN}`, "").split(":")[0];
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    tenantSlug = 
      request.nextUrl.searchParams.get("tenant") || 
      request.cookies.get("tenant-slug")?.value || 
      "__directory__";
  } else {
    // Custom domain: resolve via full hostname (without port)
    tenantSlug = hostname.split(":")[0];
  }

  // Next.js App Router (app/) reads headers from the request, not the response.
  const requestHeaders = new Headers(request.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug);
  }
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (tenantSlug) {
    // Keep cookie for backward compatibility if client components need it
    response.cookies.set("tenant-slug", tenantSlug, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)"],
};
