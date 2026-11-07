import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/xml-a-excel-gratis" },
  openGraph: { url: "/xml-a-excel-gratis", type: "website", locale: "es_MX", siteName: "XyloPDF" },
  title: "Convierte XML a Excel Gratis Online | Xylo PDF ⚡",
  description: "Usa nuestra herramienta gratuita para convertir tus XML del SAT a Excel sin registro y de forma instantánea.",
  keywords: ["convertir xml a excel gratis", "xml a excel sin registro", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
