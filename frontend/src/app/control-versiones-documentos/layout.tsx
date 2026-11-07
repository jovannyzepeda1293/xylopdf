import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/control-versiones-documentos" },
  openGraph: { url: "/control-versiones-documentos", type: "website", locale: "es_MX", siteName: "XyloPDF" },
  title: "Control de Versiones de Documentos PDF | Xylo PDF 📊",
  description: "Gestiona las versiones de tus reportes, manuales y políticas sin errores. Comparación automática para empresas y oficinas.",
  keywords: ["control versiones documentos", "gestión documental pdf", "comparar reportes", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
