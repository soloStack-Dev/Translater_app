/**
 * Injects a JSON-LD structured-data block into the page.
 *
 * Search engines use structured data for rich results (breadcrumbs, articles,
 * software apps, FAQ…). This is safe for server components only.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", ... }} />
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}