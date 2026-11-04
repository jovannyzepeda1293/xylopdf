import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizar PDF - Reordenar Páginas | XyloPDF",
  description: "Reordena, extrae o elimina las páginas de tu archivo PDF usando una interfaz intuitiva.",
  alternates: {
    canonical: `/tools/organize-pdf`,
  },
  openGraph: {
    title: "Organizar PDF - Reordenar Páginas",
    description: "Reordena, extrae o elimina las páginas de tu archivo PDF usando una interfaz intuitiva.",
    url: `/tools/organize-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Organizar PDF - Reordenar Páginas",
    "url": "https://xylopdf.com/tools/organize-pdf",
    "description": "Reordena, extrae o elimina las páginas de tu archivo PDF usando una interfaz intuitiva.",
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
