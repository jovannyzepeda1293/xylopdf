import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprimir PDF – Reduce el Tamaño sin Perder Calidad | XyloPDF",
  description: "Comprime archivos PDF al instante. Reduce el tamaño de tus documentos manteniendo la máxima calidad.",
  alternates: {
    canonical: `/tools/compress-pdf`,
  },
  openGraph: {
    title: "Comprimir PDF – Reduce el Tamaño sin Perder Calidad",
    description: "Comprime archivos PDF al instante. Reduce el tamaño de tus documentos manteniendo la máxima calidad.",
    url: `/tools/compress-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Comprimir PDF – Reduce el Tamaño sin Perder Calidad",
    "url": "https://xylopdf.com/tools/compress-pdf",
    "description": "Comprime archivos PDF al instante. Reduce el tamaño de tus documentos manteniendo la máxima calidad.",
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
