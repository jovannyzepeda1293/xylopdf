import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir PDF a Word (DOCX) | XyloPDF",
  description: "Convierte tus documentos PDF a archivos Word editables manteniendo el diseño original.",
  alternates: {
    canonical: `/tools/pdf-to-word`,
  },
  openGraph: {
    title: "Convertir PDF a Word (DOCX)",
    description: "Convierte tus documentos PDF a archivos Word editables manteniendo el diseño original.",
    url: `/tools/pdf-to-word`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir PDF a Word (DOCX)",
    "url": "https://xylopdf.com/tools/pdf-to-word",
    "description": "Convierte tus documentos PDF a archivos Word editables manteniendo el diseño original.",
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
