import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo convertir XML del SAT a Excel (Rápido y Fácil) | Xylo PDF 🔎",
  description: "Guía paso a paso para convertir tus CFDI 4.0 a Excel. Aprende a usar nuestro visor de XML y ahorra tiempo en tu contabilidad.",
  keywords: ["cómo convertir xml a excel", "visor xml cfdi", "leer xml sat", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
