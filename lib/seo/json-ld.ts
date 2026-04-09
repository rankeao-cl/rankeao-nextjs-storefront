import type { Tenant, TenantSchedule } from "@/lib/types/tenant";
import type { Product } from "@/lib/types/store";

// ── Helpers ──

function tenantUrl(tenant: Tenant): string {
  if (tenant.custom_domain) return `https://${tenant.custom_domain}`;
  return `https://${tenant.slug}.rankeao.cl`;
}

function mapDayToSchema(day: string): string {
  const map: Record<string, string> = {
    lunes: "Monday",
    martes: "Tuesday",
    miercoles: "Wednesday",
    miércoles: "Wednesday",
    jueves: "Thursday",
    viernes: "Friday",
    sabado: "Saturday",
    sábado: "Saturday",
    domingo: "Sunday",
  };
  return map[day.toLowerCase()] || day;
}

function buildOpeningHours(schedules: TenantSchedule[]): object[] {
  return schedules
    .filter((s) => !s.is_closed)
    .map((s) => {
      const day = s.day || s.day_of_week || "";
      const opens = s.open_time || s.opens_at || "09:00";
      const closes = s.close_time || s.closes_at || "18:00";
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${mapDayToSchema(day)}`,
        opens: opens.slice(0, 5),
        closes: closes.slice(0, 5),
      };
    });
}

// ── Organization Schema ──

export function buildOrganizationJsonLd(tenant: Tenant) {
  const url = tenantUrl(tenant);
  const sameAs = (tenant.social_links || []).map((link) => link.url).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: tenant.name,
    url,
    ...(tenant.logo_url ? { logo: { "@type": "ImageObject", url: tenant.logo_url } } : {}),
    ...(tenant.description ? { description: tenant.description } : {}),
    ...(tenant.email ? { email: tenant.email } : {}),
    ...(tenant.phone ? { telephone: tenant.phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(tenant.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: tenant.address,
            ...(tenant.city ? { addressLocality: tenant.city } : {}),
            ...(tenant.region ? { addressRegion: tenant.region } : {}),
            ...(tenant.postal_code ? { postalCode: tenant.postal_code } : {}),
            addressCountry: tenant.country_code || "CL",
          },
        }
      : {}),
  };
}

// ── LocalBusiness Schema (for stores with physical location) ──

export function buildLocalBusinessJsonLd(tenant: Tenant) {
  const url = tenantUrl(tenant);
  const sameAs = (tenant.social_links || []).map((link) => link.url).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${url}/#localbusiness`,
    name: tenant.name,
    url,
    ...(tenant.logo_url ? { image: tenant.logo_url } : {}),
    ...(tenant.description ? { description: tenant.description } : {}),
    ...(tenant.email ? { email: tenant.email } : {}),
    ...(tenant.phone ? { telephone: tenant.phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(tenant.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: tenant.address,
            ...(tenant.city ? { addressLocality: tenant.city } : {}),
            ...(tenant.region ? { addressRegion: tenant.region } : {}),
            ...(tenant.postal_code ? { postalCode: tenant.postal_code } : {}),
            addressCountry: tenant.country_code || "CL",
          },
        }
      : {}),
    ...(tenant.avg_rating && tenant.review_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tenant.avg_rating,
            reviewCount: tenant.review_count,
          },
        }
      : {}),
    ...(tenant.schedules && tenant.schedules.length > 0
      ? { openingHoursSpecification: buildOpeningHours(tenant.schedules) }
      : {}),
    priceRange: "$$",
  };
}

// ── Product Schema ──

export function buildProductJsonLd(product: Product, tenant: Tenant) {
  const url = tenantUrl(tenant);
  const productUrl = `${url}/producto/${product.id}`;
  const productName = product.name || product.title || "Producto";
  const images = (product.images || []).map((img) => img.url);
  const currency = product.currency || tenant.currency || "CLP";

  // Determine availability
  let availability = "https://schema.org/InStock";
  if (product.stock !== undefined && product.stock <= 0) {
    availability = "https://schema.org/OutOfStock";
  }

  // Determine item condition
  let itemCondition = "https://schema.org/NewCondition";
  if (product.card_condition) {
    const cond = product.card_condition.toLowerCase();
    if (cond.includes("used") || cond.includes("played") || cond.includes("usado")) {
      itemCondition = "https://schema.org/UsedCondition";
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}/#product`,
    name: productName,
    url: productUrl,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(product.category_name ? { category: product.category_name } : {}),
    ...(product.variants?.[0]?.sku ? { sku: product.variants[0].sku } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: product.price || 0,
      ...(product.compare_at_price && product.compare_at_price > (product.price || 0)
        ? {
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          }
        : {}),
      availability,
      itemCondition,
      seller: {
        "@type": "Organization",
        name: tenant.name,
        url,
      },
    },
  };
}

// ── BreadcrumbList Schema ──

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  tenant: Tenant
) {
  const baseUrl = tenantUrl(tenant);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

// ── WebSite Schema (for sitelinks search box) ──

export function buildWebSiteJsonLd(tenant: Tenant) {
  const url = tenantUrl(tenant);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: tenant.name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/catalogo?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ── ItemList Schema (for catalog/collection pages) ──

export function buildItemListJsonLd(
  products: Product[],
  tenant: Tenant,
  listName: string = "Catalogo"
) {
  const baseUrl = tenantUrl(tenant);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/producto/${product.id}`,
      name: product.name || product.title || "Producto",
    })),
  };
}
