import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir Word a PDF | XyloPDF",
  description: "Convierte tus documentos Word (DOC, DOCX) a archivos PDF manteniendo el diseño intacto.",
  alternates: {
    canonical: `/tools/word-to-pdf`,
  },
  openGraph: {
    title: "Convertir Word a PDF",
    description: "Convierte tus documentos Word (DOC, DOCX) a archivos PDF manteniendo el diseño intacto.",
    url: `/tools/word-to-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir Word a PDF",
    "url": "https://xylopdf.com/tools/word-to-pdf",
    "description": "Convierte tus documentos Word (DOC, DOCX) a archivos PDF manteniendo el diseño intacto.",
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
