import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir PowerPoint a PDF | XyloPDF",
  description: "Convierte tus presentaciones PPT y PPTX a formato PDF de forma instantánea.",
  alternates: {
    canonical: `/tools/ppt-to-pdf`,
  },
  openGraph: {
    title: "Convertir PowerPoint a PDF",
    description: "Convierte tus presentaciones PPT y PPTX a formato PDF de forma instantánea.",
    url: `/tools/ppt-to-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertir PowerPoint a PDF",
    "url": "https://xylopdf.com/tools/ppt-to-pdf",
    "description": "Convierte tus presentaciones PPT y PPTX a formato PDF de forma instantánea.",
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
