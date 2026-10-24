import "./globals.css";
import { getSiteUrl, siteDescription, siteName } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: {
    default: "Pinterest Image Downloader - Save HD Images Free | PinSave",
    template: "%s | PinSave",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Pinterest image downloader",
    "download Pinterest images",
    "Pinterest photo downloader",
    "Pinterest HD image downloader",
    "save Pinterest images",
  ],
  alternates: siteUrl ? { canonical: "/" } : undefined,
  robots: {
    index: Boolean(siteUrl),
    follow: Boolean(siteUrl),
    googleBot: {
      index: Boolean(siteUrl),
      follow: Boolean(siteUrl),
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: "Pinterest Image Downloader - Save HD Images Free | PinSave",
    description: siteDescription,
    url: siteUrl || undefined,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Pinterest Image Downloader - PinSave",
    description: siteDescription,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
