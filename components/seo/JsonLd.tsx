/**
 * Server component that injects JSON-LD structured data into the page.
 * Usage: <JsonLd data={buildProductJsonLd(product, tenant)} />
 *
 * This is the recommended approach from the Next.js docs:
 * render a <script type="application/ld+json"> in a server component.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
