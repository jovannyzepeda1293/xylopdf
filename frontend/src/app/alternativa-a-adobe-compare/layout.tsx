import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xylo PDF: La mejor alternativa a Adobe para comparar PDFs 🆚",
  description: "Compara PDFs de forma más rápida y barata que con Adobe Acrobat. Descubre por qué miles de usuarios prefieren Xylo PDF.",
  keywords: ["alternativa adobe acrobat", "comparar pdf adobe vs xylo", "mejor comparador pdf", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
