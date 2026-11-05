import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { PHONES } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Real data only: name, URL, description and the two supplied phone numbers.
const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Premium creative production studio: video, product shoots, ad creatives, AI video, social content and podcasts.",
  contactPoint: PHONES.map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "customer service" })),
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-bg">
        Skip to content
      </a>
      <JsonLd data={ORG} />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
