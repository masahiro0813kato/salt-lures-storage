const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://salt-lure-storage.com";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function lureBreadcrumb(lureName: string, lureSlug: string): BreadcrumbItem[] {
  return [
    { name: "SLS", url: siteUrl },
    { name: "ルアー", url: `${siteUrl}/lures` },
    { name: lureName, url: `${siteUrl}/lures/${lureSlug}` },
  ];
}
