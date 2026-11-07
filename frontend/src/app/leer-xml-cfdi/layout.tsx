import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/leer-xml-cfdi" },
  openGraph: { url: "/leer-xml-cfdi", type: "website", locale: "es_MX", siteName: "XyloPDF" },
  title: "Convierte XML del SAT a Excel en Segundos | Xylo PDF 🚀",
  description: "La forma más rápida de convertir tus facturas XML (CFDI 4.0) a Excel. Extrae impuestos, RFCs y montos sin errores y sin captura manual.",
  keywords: ["leer xml sat", "xml a excel sat", "convertir cfdi a excel", "Xylo PDF"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
