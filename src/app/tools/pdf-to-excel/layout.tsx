import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir PDF a Excel (XLSX) | XyloPDF",
  description: "Extrae tablas y datos de tus archivos PDF y conviértelos a hojas de cálculo Excel editables.",
  alternates: {
    canonical: `/tools/pdf-to-excel`,
  },
  openGraph: {
    title: "Convertir PDF a Excel (XLSX)",
    description: "Extrae tablas y datos de tus archivos PDF y conviértelos a hojas de cálculo Excel editables.",
    url: `/tools/pdf-to-excel`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir PDF a Excel (XLSX)",
    "url": "https://xylopdf.com/tools/pdf-to-excel",
    "description": "Extrae tablas y datos de tus archivos PDF y conviértelos a hojas de cálculo Excel editables.",
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
