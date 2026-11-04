import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir Excel a PDF | XyloPDF",
  description: "Convierte tus hojas de cálculo XLSX y XLS a PDF fácilmente conservando el formato y tablas.",
  alternates: {
    canonical: `/tools/excel-to-pdf`,
  },
  openGraph: {
    title: "Convertir Excel a PDF",
    description: "Convierte tus hojas de cálculo XLSX y XLS a PDF fácilmente conservando el formato y tablas.",
    url: `/tools/excel-to-pdf`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir Excel a PDF",
    "url": "https://xylopdf.com/tools/excel-to-pdf",
    "description": "Convierte tus hojas de cálculo XLSX y XLS a PDF fácilmente conservando el formato y tablas.",
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
