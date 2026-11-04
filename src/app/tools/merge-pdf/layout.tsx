import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unir PDF Online – Combina Varios Archivos | XyloPDF",
  description: "Combina varios archivos PDF en un único documento. Es online, rápido y gratuito.",
  alternates: {
    canonical: `/tools/merge-pdf`,
  },
  openGraph: {
    title: "Unir PDF Online – Combina Varios Archivos",
    description: "Combina varios archivos PDF en un único documento. Es online, rápido y gratuito.",
    url: `/tools/merge-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Unir PDF Online – Combina Varios Archivos",
    "url": "https://xylopdf.com/tools/merge-pdf",
    "description": "Combina varios archivos PDF en un único documento. Es online, rápido y gratuito.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
