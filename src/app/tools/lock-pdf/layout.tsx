import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bloquear PDF con Contraseña Seguro | XyloPDF",
  description: "Protege tus documentos PDF añadiendo una contraseña segura. Encriptación fuerte gratuita.",
  alternates: {
    canonical: `/tools/lock-pdf`,
  },
  openGraph: {
    title: "Bloquear PDF con Contraseña Seguro",
    description: "Protege tus documentos PDF añadiendo una contraseña segura. Encriptación fuerte gratuita.",
    url: `/tools/lock-pdf`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bloquear PDF con Contraseña Seguro",
    "url": "https://xylopdf.com/tools/lock-pdf",
    "description": "Protege tus documentos PDF añadiendo una contraseña segura. Encriptación fuerte gratuita.",
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
