"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Zap, Heart, Cpu, Globe, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function NosotrosPage() {
  const { t, lang } = useI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "XyloPDF",
      "description": lang === 'es' ? "Plataforma líder en herramientas de edición y conversión de PDF." : "Leading platform for PDF editing and conversion tools.",
      "url": "https://xylopdf.com",
      "logo": "https://xylopdf.com/logo.png"
    }
  };

  return (
    <>
      <title>{t.about.metaTitle}</title>
      <meta name="description" content={t.about.metaDesc} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              {t.about.heroTitle} <br />
              <span className="text-gradient">{t.about.heroAccent}</span>
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              {t.about.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Values Grid */}
        <section className="bg-accent/30 py-24 mb-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">{t.about.pillarsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="glass p-8 rounded-3xl group hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t.about.pillar1Title}</h3>
                <p className="text-secondary leading-relaxed">
                  {t.about.pillar1Desc}
                </p>
              </div>
              <div className="glass p-8 rounded-3xl group hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-purple-500/10 rounded-2xl w-fit mb-6">
                  <Zap className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t.about.pillar2Title}</h3>
                <p className="text-secondary leading-relaxed">
                  {t.about.pillar2Desc}
                </p>
              </div>
              <div className="glass p-8 rounded-3xl group hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-pink-500/10 rounded-2xl w-fit mb-6">
                  <Heart className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold mb-4">{t.about.pillar3Title}</h3>
                <p className="text-secondary leading-relaxed">
                  {t.about.pillar3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">{t.about.faqTitle}</h2>
          <div className="space-y-8">
            <div className="border-b border-border pb-6">
              <h4 className="text-lg font-bold mb-2">{t.about.q1}</h4>
              <p className="text-secondary italic">
                {t.about.a1}
              </p>
            </div>
            <div className="border-b border-border pb-6">
              <h4 className="text-lg font-bold mb-2">{t.about.q2}</h4>
              <p className="text-secondary">
                {t.about.a2}
              </p>
            </div>
          </div>
        </section>

        {/* Global Impact Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
          <div className="glass p-12 rounded-[3rem] border border-primary/20">
            <Cpu className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="text-4xl font-bold mb-6 italic">{t.about.impactTitle}</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto mb-10">
              {t.about.impactDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="flex items-center gap-2"><Globe className="w-5 h-5" /> {t.about.countries}</span>
               <span className="flex items-center gap-2"><Lock className="w-5 h-5" /> {t.about.noDataSold}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
