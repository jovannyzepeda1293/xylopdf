"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, EyeOff, ShieldCheck, Database, Trash2, FileWarning } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function PrivacidadPage() {
  const { t, lang } = useI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicyPage",
    "name": lang === 'es' ? "Política de Privacidad de XyloPDF" : "XyloPDF Privacy Policy",
    "description": lang === 'es' ? "Detalles sobre cómo manejamos tus datos y archivos en nuestra plataforma." : "Details about how we handle your data and files on our platform.",
    "publisher": {
      "@type": "Organization",
      "name": "XyloPDF",
      "url": "https://xylopdf.com"
    }
  };

  return (
    <>
      <title>{t.privacy.metaTitle}</title>
      <meta name="description" content={t.privacy.metaDesc} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.privacy.title}</h1>
            <p className="text-lg text-secondary leading-relaxed">
              {t.privacy.subtitle}
            </p>
          </div>

          <div className="space-y-16">
            {/* Core Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl">
                <EyeOff className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">{t.privacy.commitment1Title}</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {t.privacy.commitment1Desc}
                </p>
              </div>
              <div className="glass p-8 rounded-3xl">
                <Trash2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">{t.privacy.commitment2Title}</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {t.privacy.commitment2Desc}
                </p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldCheck className="text-green-500" /> {t.privacy.howTitle}
              </h2>
              <div className="space-y-6 text-secondary">
                <p>
                  {t.privacy.howDesc1}
                </p>
                <div className="bg-accent/30 p-6 rounded-2xl border border-border">
                  <h4 className="text-foreground font-bold mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" /> {t.privacy.storageTitle}
                  </h4>
                  <p className="text-sm">
                    {t.privacy.storageDesc}
                  </p>
                </div>
                <p>
                  {t.privacy.howDesc2}
                </p>
              </div>
            </div>

            {/* Compliance Section */}
            <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20">
              <h2 className="text-2xl font-bold mb-6 text-center">{t.privacy.complianceTitle}</h2>
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center opacity-80">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-bold text-lg">GDPR</span>
                  <span className="text-xs text-secondary">{t.privacy.gdpr}</span>
                </div>
                <div className="w-px h-12 bg-border hidden md:block" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-bold text-lg">SSL</span>
                  <span className="text-xs text-secondary">{t.privacy.ssl}</span>
                </div>
                <div className="w-px h-12 bg-border hidden md:block" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-bold text-lg">AES-256</span>
                  <span className="text-xs text-secondary">{t.privacy.aes}</span>
                </div>
              </div>
            </div>

            {/* User Rights */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FileWarning className="text-yellow-500" /> {t.privacy.rightsTitle}
              </h2>
              <p className="text-secondary leading-relaxed">
                {t.privacy.rightsDesc}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
