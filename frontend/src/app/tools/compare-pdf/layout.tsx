import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar PDF Online Gratis | XyloPDF",
  description: "Encuentra diferencias entre dos versiones de un PDF. Compara textos y páginas de forma visual.",
  alternates: {
    canonical: `/tools/compare-pdf`,
  },
  openGraph: {
    title: "Comparar PDF Online Gratis",
    description: "Encuentra diferencias entre dos versiones de un PDF. Compara textos y páginas de forma visual.",
    url: `/tools/compare-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Comparar PDF Online Gratis",
    "url": "https://xylopdf.com/tools/compare-pdf",
    "description": "Encuentra diferencias entre dos versiones de un PDF. Compara textos y páginas de forma visual.",
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
