import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/comparar-contratos" },
  openGraph: { url: "/comparar-contratos", type: "website", locale: "es_MX", siteName: "XyloPDF" },
  title: "Comparar Contratos PDF | Detecta Cambios en Segundos ⚖️",
  description: "Herramienta especializada para abogados. Detecta cláusulas modificadas, eliminadas o añadidas en tus contratos de forma automática.",
  keywords: ["comparar contratos", "revisión legal pdf", "comparar convenios", "abogados pdf", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
