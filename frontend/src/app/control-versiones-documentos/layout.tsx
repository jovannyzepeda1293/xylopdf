import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control de Versiones de Documentos PDF | Xylo PDF 📊",
  description: "Gestiona las versiones de tus reportes, manuales y políticas sin errores. Comparación automática para empresas y oficinas.",
  keywords: ["control versiones documentos", "gestión documental pdf", "comparar reportes", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
