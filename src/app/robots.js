import { getSiteUrl } from "@/lib/site";

export default function robots() {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
