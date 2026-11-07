import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertidor XML a Excel Masivo – Reporte Contable CFDI",
  description: "La herramienta definitiva para contadores. Sube múltiples facturas XML (CFDI 3.3 y 4.0) y genera automáticamente un reporte Excel con IVA, IEPS, Retenciones, RFC y Cuentas de Terceros.",
  alternates: {
    canonical: `/tools/expense-report`,
  },
  openGraph: {
    title: "Conversor de XML a Excel para Contabilidad | XyloPDF",
    description: "Extrae de forma masiva datos de facturas CFDI. Genera reportes contables en Excel con impuestos detallados y RFCs de forma instantánea.",
    url: `/tools/expense-report`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convertidor Masivo de XML a Excel para Contabilidad",
    "url": "https://xylopdf.com/tools/expense-report",
    "description": "Herramienta profesional para convertir facturas XML (CFDI) a Excel. Extrae IVA, ISR, Retenciones y RFCs para contadores.",
    "applicationCategory": "AccountingApplication",
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
