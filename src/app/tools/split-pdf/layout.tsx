import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dividir PDF - Extraer Páginas de PDF | XyloPDF",
  description: "Extrae una o varias páginas de tu PDF o divide el documento en varios archivos independientes.",
  alternates: {
    canonical: `/tools/split-pdf`,
  },
  openGraph: {
    title: "Dividir PDF - Extraer Páginas de PDF",
    description: "Extrae una o varias páginas de tu PDF o divide el documento en varios archivos independientes.",
    url: `/tools/split-pdf`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dividir PDF - Extraer Páginas de PDF",
    "url": "https://xylopdf.com/tools/split-pdf",
    "description": "Extrae una o varias páginas de tu PDF o divide el documento en varios archivos independientes.",
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
