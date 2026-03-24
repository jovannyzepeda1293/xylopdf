"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ShieldAlert, Scale, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function TerminosPage() {
  const { t, lang } = useI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": lang === 'es' ? "Términos y Condiciones | XyloPDF" : "Terms and Conditions | XyloPDF",
    "description": lang === 'es' ? "Reglas y términos legales para el uso de XyloPDF." : "Legal rules and terms for the use of XyloPDF.",
    "publisher": {
      "@type": "Organization",
      "name": "XyloPDF",
      "url": "https://xylopdf.com"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <title>{t.terms.metaTitle}</title>
      <meta name="description" content={t.terms.metaDesc} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.terms.title}</h1>
            <p className="text-lg text-secondary leading-relaxed">
              {t.terms.subtitle}
            </p>
          </div>

          <div className="space-y-12">
            {/* Section 1 */}
            <div className="glass p-8 rounded-3xl border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <ShieldAlert className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">{t.terms.section1Title}</h2>
              </div>
              <p className="text-secondary leading-relaxed">
                {t.terms.section1Desc}
              </p>
            </div>

            {/* Section 2 */}
            <div className="glass p-8 rounded-3xl border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">{t.terms.section2Title}</h2>
              </div>
              <p className="text-secondary leading-relaxed">
                {t.terms.section2Desc}
              </p>
            </div>

            {/* Section 3 & 4 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <Scale className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">{t.terms.section3Title}</h2>
                </div>
                <p className="text-secondary text-sm leading-relaxed">
                  {t.terms.section3Desc}
                </p>
              </div>
              
              <div className="glass p-8 rounded-3xl border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">{t.terms.section4Title}</h2>
                </div>
                <p className="text-secondary text-sm leading-relaxed">
                  {t.terms.section4Desc}
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
