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
  title: "XyloPDF - Unir, Dividir, Comprimir y Convertir PDF Gratis Online",
  description: "Une, divide, comprime, convierte y edita archivos PDF online, gratis y sin instalar nada. PDF a Word, Excel, JPG, OCR, proteger y desbloquear PDF.",
  authors: [{ name: "XyloPDF" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: {
    title: "XyloPDF - Herramientas PDF Gratis Online",
    description: "Une, divide, comprime y convierte PDF gratis, de forma rápida y segura.",
    url: "/",
    siteName: "XyloPDF",
    type: "website",
    locale: "es_MX",
    alternateLocale: ["en_US"],
    images: [{ url: "/og", width: 1200, height: 630, alt: "XyloPDF" }],
  },
  // Solo card: X/Twitter cae a og:title/og:description de cada página.
  twitter: { card: "summary_large_image", images: ["/og"] },
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://xylopdf.com/#org",
    name: "XyloPDF",
    url: "https://xylopdf.com",
    logo: "https://xylopdf.com/logo.svg",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://xylopdf.com/#website",
    name: "XyloPDF",
    url: "https://xylopdf.com",
    inLanguage: ["es", "en"],
    publisher: { "@id": "https://xylopdf.com/#org" },
  },
];

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
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
