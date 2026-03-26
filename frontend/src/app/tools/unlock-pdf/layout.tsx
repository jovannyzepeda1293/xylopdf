import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desbloquear PDF - Quitar Contraseña | XyloPDF",
  description: "Elimina la seguridad y la contraseña de tus archivos PDF permanentemente para que puedas editarlos.",
  alternates: {
    canonical: `/tools/deslock-pdf`,
  },
  openGraph: {
    title: "Desbloquear PDF - Quitar Contraseña",
    description: "Elimina la seguridad y la contraseña de tus archivos PDF permanentemente para que puedas editarlos.",
    url: `/tools/deslock-pdf`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Desbloquear PDF - Quitar Contraseña",
    "url": "https://xylopdf.com/tools/deslock-pdf",
    "description": "Elimina la seguridad y la contraseña de tus archivos PDF permanentemente para que puedas editarlos.",
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
