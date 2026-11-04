import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre XyloPDF | XyloPDF",
  description: "Conoce XyloPDF: herramientas PDF online rápidas, seguras y gratuitas para unir, dividir, comprimir y convertir documentos.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Sobre XyloPDF", description: "Conoce XyloPDF: herramientas PDF online rápidas, seguras y gratuitas para unir, dividir, comprimir y convertir documentos.", url: "/about", siteName: "XyloPDF", type: "website", images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
