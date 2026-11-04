import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir PDF a PowerPoint (PPT) | XyloPDF",
  description: "Transforma tus archivos PDF en presentaciones de PowerPoint editables rápidamente.",
  alternates: {
    canonical: `/tools/pdf-to-ppt`,
  },
  openGraph: {
    title: "Convertir PDF a PowerPoint (PPT)",
    description: "Transforma tus archivos PDF en presentaciones de PowerPoint editables rápidamente.",
    url: `/tools/pdf-to-ppt`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir PDF a PowerPoint (PPT)",
    "url": "https://xylopdf.com/tools/pdf-to-ppt",
    "description": "Transforma tus archivos PDF en presentaciones de PowerPoint editables rápidamente.",
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
