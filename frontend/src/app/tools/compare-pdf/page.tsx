"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparePdfUploader from "@/components/ComparePdfUploader";
import { FileSearch } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function CompararPdfPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-16">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FileSearch className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t.comparePdf.title.split(" ")[0]} <span className="text-primary">{t.comparePdf.title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
              {t.comparePdf.description}
            </p>
          </div>

          <ComparePdfUploader />
        
          {/* SEO Content Section */}
          <section className="mt-24 border-t border-border/10 pt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto text-left space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t.comparePdf.seoTitle}
              </h2>
              <div className="prose prose-lg prose-p:text-secondary max-w-none">
                <p className="leading-relaxed">
                  {t.comparePdf.seoP1}
                </p>
                <p className="leading-relaxed">
                  {t.comparePdf.seoP2}
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
                    <span>{t.comparePdf.step1}</span>
                  </li>
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">2.</span>
                    <span>{t.comparePdf.step2}</span>
                  </li>
                  <li className="flex items-start gap-4 text-secondary">
                    <span className="font-bold text-primary min-w-[1.5rem] mt-0.5">3.</span>
                    <span>{t.comparePdf.step3}</span>
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
