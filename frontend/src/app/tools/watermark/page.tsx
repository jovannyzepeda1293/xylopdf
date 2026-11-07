"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddWatermarkUploader from "@/components/AddWatermarkUploader";
import { Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { motion } from "framer-motion";

export default function MarcaDeAguaPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block p-4 bg-primary/10 rounded-full mb-6"
            >
              <Layers className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {t.watermark.title.split(" ")[0]} <span className="text-primary">{t.watermark.title.split(" ").slice(1).join(" ")}</span>
            </motion.h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              {t.watermark.description}
            </p>
          </div>

          <AddWatermarkUploader />

          {/* Info Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-xl font-bold mb-4">{t.watermark.benefit1Title}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {t.watermark.benefit1Desc}
              </p>
            </div>
            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-xl font-bold mb-4">{t.watermark.benefit2Title}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {t.watermark.benefit2Desc}
              </p>
            </div>
            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-xl font-bold mb-4">{t.watermark.benefit3Title}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {t.watermark.benefit3Desc}
              </p>
            </div>
          </div>
        
          {/* SEO Content Section */}
          <section className="mt-24 border-t border-border/10 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto text-left space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t.watermark.seoTitle}
              </h2>
              <div className="prose prose-lg prose-p:text-secondary max-w-none">
                <p className="leading-relaxed">
                  {t.watermark.seoP1}
                </p>
                <p className="leading-relaxed">
                  {t.watermark.seoP2}
                </p>
              </div>
              
              <div className="glass p-8 rounded-3xl border border-border/50 mt-12 bg-accent/5">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">✓</span>
                  {t.common.howToUse}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">1.</span>
                    <span>{t.watermark.step1}</span>
                  </li>
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">2.</span>
                    <span>{t.watermark.step2}</span>
                  </li>
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">3.</span>
                    <span>{t.watermark.step3}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
