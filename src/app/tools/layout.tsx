import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todas las Herramientas PDF | XyloPDF",
  description: "Explora la colección completa de herramientas para editar, convertir, comprimir, unir y proteger archivos PDF online gratis.",
  alternates: {
    canonical: `/tools`,
  },
  openGraph: {
    title: "Herramientas PDF Avanzadas y Gratuitas",
    description: "La paquetería más completa de utilidades PDF para uso personal y profesional.",
    url: `/tools`,
    siteName: "XyloPDF",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
