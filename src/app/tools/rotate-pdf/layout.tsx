import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Girar PDF - Rotar Páginas | XyloPDF",
  description: "Rota páginas de tus archivos PDF permanentemente. Gira a la derecha o izquierda en un clic.",
  alternates: {
    canonical: `/tools/rotate-pdf`,
  },
  openGraph: {
    title: "Girar PDF - Rotar Páginas",
    description: "Rota páginas de tus archivos PDF permanentemente. Gira a la derecha o izquierda en un clic.",
    url: `/tools/rotate-pdf`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Girar PDF - Rotar Páginas",
    "url": "https://xylopdf.com/tools/rotate-pdf",
    "description": "Rota páginas de tus archivos PDF permanentemente. Gira a la derecha o izquierda en un clic.",
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
