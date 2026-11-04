import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | XyloPDF",
  description: "Términos y condiciones de uso de las herramientas PDF online de XyloPDF.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Términos y Condiciones", description: "Términos y condiciones de uso de las herramientas PDF online de XyloPDF.", url: "/terms", siteName: "XyloPDF", type: "website", images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
