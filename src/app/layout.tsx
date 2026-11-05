import type { Metadata } from "next";
import { Space_Grotesk, Inter, Cormorant_Garamond } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"],
  variable: "--font-cormorant", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Prominence Creative — Premium Creative Production", template: "%s | Prominence Creative" },
  description: "We create premium visual content that makes brands stand out. Video production, product shoots, ad creatives, AI video, social content and podcasts.",
  openGraph: { title: "Prominence Creative", description: "Premium creative production studio.", type: "website", siteName: "Prominence Creative", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${inter.variable} ${cormorant.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
