import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automatiza la Lectura de Facturas del SAT | Xylo PDF ⚡",
  description: "Ahorra tiempo y elimina errores humanos. Procesa tus facturas XML automáticamente y genera reportes de gastos en Excel.",
  keywords: ["automatizar facturas", "lectura facturas sat", "procesar xml masivo", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
