import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir PDF a JPG (Imágenes) | XyloPDF",
  description: "Extrae y convierte cada página de tu archivo PDF en una imagen JPG de alta calidad.",
  alternates: {
    canonical: `/tools/pdf-to-jpg`,
  },
  openGraph: {
    title: "Convertir PDF a JPG (Imágenes)",
    description: "Extrae y convierte cada página de tu archivo PDF en una imagen JPG de alta calidad.",
    url: `/tools/pdf-to-jpg`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir PDF a JPG (Imágenes)",
    "url": "https://xylopdf.com/tools/pdf-to-jpg",
    "description": "Extrae y convierte cada página de tu archivo PDF en una imagen JPG de alta calidad.",
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
