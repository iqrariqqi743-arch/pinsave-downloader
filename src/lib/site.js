export const siteName = "PinSave";
export const siteDescription =
  "Download public Pinterest images in the best available quality. Paste a Pinterest Pin URL, preview the image, and save it for free. No account required.";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return null;
    return url.origin;
  } catch {
    return null;
  }
}
