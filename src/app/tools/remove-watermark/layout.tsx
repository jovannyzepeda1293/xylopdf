import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eliminar Marca de Agua de PDF | XyloPDF",
  description: "Quita marcas de agua molestas de tus archivos PDF de forma rápida, sencilla y gratuita.",
  alternates: {
    canonical: `/tools/remove-watermark`,
  },
  openGraph: {
    title: "Eliminar Marca de Agua de PDF",
    description: "Quita marcas de agua molestas de tus archivos PDF de forma rápida, sencilla y gratuita.",
    url: `/tools/remove-watermark`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Eliminar Marca de Agua de PDF",
    "url": "https://xylopdf.com/tools/remove-watermark",
    "description": "Quita marcas de agua molestas de tus archivos PDF de forma rápida, sencilla y gratuita.",
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
