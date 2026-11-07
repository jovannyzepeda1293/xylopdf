"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolPageHeader from "@/components/ToolPageHeader";
import RotateUploader from "@/components/RotateUploader";
import { RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function GirarPDFPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <ToolPageHeader 
            title={t.rotatePdf.title}
            description={t.rotatePdf.description}
            icon={RotateCw}
            color="bg-purple-600"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RotateUploader />
          </motion.div>

          {/* Educational / Features Section */}
          <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">{t.rotatePdf.benefit1Title}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {t.rotatePdf.benefit1Desc}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t.rotatePdf.benefit2Title}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {t.rotatePdf.benefit2Desc}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t.rotatePdf.benefit3Title}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {t.rotatePdf.benefit3Desc}
              </p>
            </div>
          </section>
        
          {/* SEO Content Section */}
          <section className="mt-24 border-t border-border/10 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto text-left space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t.rotatePdf.seoTitle}
              </h2>
              <div className="prose prose-lg prose-p:text-secondary max-w-none">
                <p className="leading-relaxed">
                  {t.rotatePdf.seoP1}
                </p>
                <p className="leading-relaxed">
                  {t.rotatePdf.seoP2}
                </p>
              </div>
              
              <div className="glass p-8 rounded-3xl border border-border/50 mt-12 bg-accent/5">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">✓</span>
                  {t.toolCommon.howToTitle}
                </h3>
                <ul className="space-y-4">
                  
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">1.</span>
                    <span>{t.rotatePdf.step1}</span>
                  </li>
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">2.</span>
                    <span>{t.rotatePdf.step2}</span>
                  </li>
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">3.</span>
                    <span>{t.rotatePdf.step3}</span>
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
