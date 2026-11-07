import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/comparar-pdf-online" },
  openGraph: { url: "/comparar-pdf-online", type: "website", locale: "es_MX", siteName: "XyloPDF" },
  title: "Comparar dos PDFs en Segundos | Comparador Online 🔥",
  description: "Detección automática de cambios entre dos PDF. Rápido, seguro y sin registro. La mejor herramienta para comparar documentos online.",
  keywords: ["comparar pdf", "comparar documentos pdf", "pdf compare online", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
