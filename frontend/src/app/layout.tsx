import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://xylopdf.com"),
  title: "XyloPDF - El Mejor Conversor y Editor de PDF Moderno",
  description: "La herramienta de PDF definitiva: une, divide, convierte, comprime y edita tus archivos PDF de forma rápida, segura y gratuita. Optimizado para profesionales y empresas.",
  keywords: ["XyloPDF", "pdf converter", "unir pdf", "dividir pdf", "comprimir pdf", "convertir pdf a word", "ocr pdf", "desbloquear pdf", "pdf editor online"],
  authors: [{ name: "Zepeda" }],
  alternates: {
    canonical: "/",
  },
  robots: "index, follow",
  openGraph: {
    title: "XyloPDF - Edición de PDF Rápida y Profesional",
    description: "Herramientas de PDF gratuitas y potentes con un diseño intuitivo.",
    url: "https://xylopdf.com",
    siteName: "XyloPDF",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "XyloPDF - El Futuro de la Gestión de PDF",
    description: "Convierte y edita PDFs con la mejor interfaz del mercado.",
  },
};

import AuthProvider from "@/components/AuthProvider";
import ConfirmationGate from "@/components/ConfirmationGate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { I18nProvider } from "@/lib/i18n/I18nContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const showAdSense = !session?.user?.subscriptionActive;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ACCOUNT;

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {showAdSense && adsenseId && (
          <meta name="google-adsense-account" content={adsenseId} />
        )}
      </head>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <I18nProvider>
          <AuthProvider>
            <ConfirmationGate />
            <div className="relative min-h-screen flex flex-col">
              {children}
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
