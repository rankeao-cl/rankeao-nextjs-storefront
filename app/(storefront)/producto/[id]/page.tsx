import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTenant } from "@/lib/api/tenant";
import { getProductDetail } from "@/lib/api/store";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import JsonLd from "@/components/seo/JsonLd";
import ProductDetailClient from "@/features/catalog/ProductDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Server-side metadata generation for product pages.
 * This ensures Google sees full title, description, OG tags, and canonical
 * on the initial HTML response -- critical for indexing product pages.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  try {
    const [tenant, productData] = await Promise.all([
      getTenant(slug),
      getProductDetail(id),
    ]);

    const product = productData?.data?.product;
    if (!product) return { title: "Producto no encontrado" };

    const productName = product.name || product.title || "Producto";
    const description =
      product.description?.slice(0, 160) ||
      `Compra ${productName} en ${tenant.name}. Disponible online con envio a todo Chile.`;

    const baseUrl = tenant.custom_domain
      ? `https://${tenant.custom_domain}`
      : `https://${slug}.rankeao.cl`;

    const images = (product.images || []).map((img) => ({
      url: img.url,
      width: 800,
      height: 800,
      alt: productName,
    }));

    return {
      title: productName,
      description,
      alternates: {
        canonical: `${baseUrl}/producto/${id}`,
      },
      openGraph: {
        title: `${productName} | ${tenant.name}`,
        description,
        url: `${baseUrl}/producto/${id}`,
        type: "website",
        locale: "es_CL",
        siteName: tenant.name,
        images: images.length > 0 ? images : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: productName,
        description,
        images: images.length > 0 ? [images[0].url] : undefined,
      },
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const slug = cookieStore.get("tenant-slug")?.value || "calabozo";

  // Attempt to fetch data server-side for JSON-LD injection.
  // The client component will still fetch independently via React Query
  // for interactivity (cart, quantity, etc.), but the structured data
  // is already in the HTML for crawlers.
  let jsonLdScripts: React.ReactNode = null;

  try {
    const [tenant, productData] = await Promise.all([
      getTenant(slug),
      getProductDetail(id),
    ]);

    const product = productData?.data?.product;

    if (product) {
      const productName = product.name || product.title || "Producto";
      const baseUrl = tenant.custom_domain
        ? `https://${tenant.custom_domain}`
        : `https://${slug}.rankeao.cl`;

      const breadcrumbItems = [
        { name: "Inicio", url: "/" },
        { name: "Catalogo", url: "/catalogo" },
        ...(product.category_name
          ? [{ name: product.category_name, url: `/catalogo?categoria=${product.category_id || ""}` }]
          : []),
        { name: productName, url: `/producto/${id}` },
      ];

      jsonLdScripts = (
        <>
          <JsonLd data={buildProductJsonLd(product, tenant)} />
          <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, tenant)} />
        </>
      );
    }
  } catch {
    // Structured data is a progressive enhancement -- degrade gracefully
  }

  return (
    <>
      {jsonLdScripts}
      <ProductDetailClient productId={id} />
    </>
  );
}
