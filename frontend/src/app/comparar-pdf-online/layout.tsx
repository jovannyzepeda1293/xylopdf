import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar dos PDFs en Segundos | Comparador Online 🔥",
  description: "Detección automática de cambios entre dos PDF. Rápido, seguro y sin registro. La mejor herramienta para comparar documentos online.",
  keywords: ["comparar pdf", "comparar documentos pdf", "pdf compare online", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
