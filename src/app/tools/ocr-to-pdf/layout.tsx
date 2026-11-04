import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR a PDF - Convertir Escaneos a Texto | XyloPDF",
  description: "Convierte documentos e imágenes escaneadas en archivos PDF con texto seleccionable y buscable (OCR).",
  alternates: {
    canonical: `/tools/ocr-to-pdf`,
  },
  openGraph: {
    title: "OCR a PDF - Convertir Escaneos a Texto",
    description: "Convierte documentos e imágenes escaneadas en archivos PDF con texto seleccionable y buscable (OCR).",
    url: `/tools/ocr-to-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OCR a PDF - Convertir Escaneos a Texto",
    "url": "https://xylopdf.com/tools/ocr-to-pdf",
    "description": "Convierte documentos e imágenes escaneadas en archivos PDF con texto seleccionable y buscable (OCR).",
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
