import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Añadir Marca de Agua a PDF | XyloPDF",
  description: "Agrega texto o imágenes como marca de agua en tus archivos PDF para proteger tu propiedad intelectual.",
  alternates: {
    canonical: `/tools/watermark`,
  },
  openGraph: {
    title: "Añadir Marca de Agua a PDF",
    description: "Agrega texto o imágenes como marca de agua en tus archivos PDF para proteger tu propiedad intelectual.",
    url: `/tools/watermark`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Añadir Marca de Agua a PDF",
    "url": "https://xylopdf.com/tools/watermark",
    "description": "Agrega texto o imágenes como marca de agua en tus archivos PDF para proteger tu propiedad intelectual.",
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
