import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/herramientas-contadores" },
  openGraph: { url: "/herramientas-contadores", type: "website", locale: "es_MX", siteName: "XyloPDF" },
  title: "Herramientas Digitales para Contadores Modernos | Xylo PDF 💼",
  description: "Optimiza tu despacho contable con nuestra herramienta de conversión masiva de XML a Excel. Organización por cliente y reportes detallados.",
  keywords: ["herramientas contadores", "despacho contable digital", "xml a excel contadores", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
