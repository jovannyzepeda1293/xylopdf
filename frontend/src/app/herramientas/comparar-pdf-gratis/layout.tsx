import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de PDF Gratis Online | Sin Registro 🧾",
  description: "Usa nuestra herramienta gratuita para comparar archivos PDF online. Sin límites, sin registro y 100% seguro.",
  keywords: ["comparar pdf gratis", "pdf compare free online", "herramienta pdf gratuita", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
