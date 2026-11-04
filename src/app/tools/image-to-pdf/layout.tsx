import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir Imágenes a PDF (JPG, PNG, WebP) | XyloPDF",
  description: "Convierte imágenes JPG, PNG, y WebP a documentos PDF. Une varias fotos en un solo archivo.",
  alternates: {
    canonical: `/tools/image-to-pdf`,
  },
  openGraph: {
    title: "Convertir Imágenes a PDF (JPG, PNG, WebP)",
    description: "Convierte imágenes JPG, PNG, y WebP a documentos PDF. Une varias fotos en un solo archivo.",
    url: `/tools/image-to-pdf`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir Imágenes a PDF (JPG, PNG, WebP)",
    "url": "https://xylopdf.com/tools/image-to-pdf",
    "description": "Convierte imágenes JPG, PNG, y WebP a documentos PDF. Une varias fotos en un solo archivo.",
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
