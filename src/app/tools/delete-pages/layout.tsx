import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eliminar Páginas de PDF | XyloPDF",
  description: "Quita las páginas innecesarias de tus documentos PDF. Fácil, rápido y online.",
  alternates: {
    canonical: `/tools/delete-pages`,
  },
  openGraph: {
    title: "Eliminar Páginas de PDF",
    description: "Quita las páginas innecesarias de tus documentos PDF. Fácil, rápido y online.",
    url: `/tools/delete-pages`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Eliminar Páginas de PDF",
    "url": "https://xylopdf.com/tools/delete-pages",
    "description": "Quita las páginas innecesarias de tus documentos PDF. Fácil, rápido y online.",
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
