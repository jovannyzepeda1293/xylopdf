import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | XyloPDF",
  description: "Cómo XyloPDF protege tus datos y archivos: procesamiento seguro y eliminación automática de tus documentos.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Política de Privacidad", description: "Cómo XyloPDF protege tus datos y archivos: procesamiento seguro y eliminación automática de tus documentos.", url: "/privacy", siteName: "XyloPDF", type: "website", images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
