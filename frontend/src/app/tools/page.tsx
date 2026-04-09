"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PDFToolCard from "@/components/PDFToolCard";
import { 
  Merge, Split, RotateCw, Trash2, FileSearch, Eraser, 
  FileText, FileSpreadsheet, Presentation, Image as ImageIcon, 
  Lock, Unlock, ScanLine, FileDown, Layers, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n/I18nContext";

function ToolsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update } = useSession();
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState("All");

  // Re-map tools with translations
  const localizedCategorizedTools = [
    {
      category: t.toolsPage.categoryConvert,
      slug: "Conversion",
      description: t.toolsPage.descConvert,
      tools: [
        { title: t.tools.pdfToWord, slug: "pdf-to-word", description: t.tools.wordDesc, icon: FileText, color: "bg-blue-500" },
        { title: t.tools.pdfToExcel, slug: "pdf-to-excel", description: t.tools.excelDesc, icon: FileSpreadsheet, color: "bg-green-600" },
        { title: t.tools.pdfToPpt, slug: "pdf-to-ppt", description: t.tools.pptDesc, icon: Presentation, color: "bg-orange-600" },
        { title: t.tools.pdfToJpg, slug: "pdf-to-jpg", description: t.tools.pdfToJpgDesc, icon: ImageIcon, color: "bg-yellow-600" },
        { title: t.tools.imageToPdf, slug: "image-to-pdf", description: t.tools.imageToPdfDesc, icon: ImageIcon, color: "bg-teal-600" },
        { title: t.tools.ocr, slug: "ocr-to-pdf", description: t.tools.ocrDesc, icon: ScanLine, color: "bg-sky-600" },
        { title: t.tools.wordToPdf, slug: "word-to-pdf", description: t.tools.wordDesc, icon: FileText, color: "bg-blue-600" },
        { title: t.tools.excelToPdf, slug: "excel-to-pdf", description: t.tools.excelDesc, icon: FileSpreadsheet, color: "bg-green-700" },
        { title: t.tools.pptToPdf, slug: "ppt-to-pdf", description: t.tools.pptDesc, icon: Presentation, color: "bg-orange-700" },
      ]
    },
    {
      category: t.toolsPage.categoryEdit,
      slug: "Editing",
      description: t.toolsPage.descEdit,
      tools: [
        { title: t.tools.unir, slug: "merge-pdf", description: t.tools.unirDesc, icon: Merge, color: "bg-blue-600" },
        { title: t.tools.dividir, slug: "split-pdf", description: t.tools.dividirDesc, icon: Split, color: "bg-indigo-600" },
        { title: t.tools.girar, slug: "rotate-pdf", description: t.tools.girarDesc, icon: RotateCw, color: "bg-purple-600" },
        { title: t.tools.deletePages, slug: "delete-pages", description: t.tools.eliminarDesc, icon: Trash2, color: "bg-red-600" },
        { title: t.tools.organizePdf, slug: "organize-pdf", description: t.tools.organizePdfDesc, icon: FileSearch, color: "bg-pink-600" },
        { title: t.tools.watermark, slug: "watermark", description: t.tools.watermarkDesc, icon: Layers, color: "bg-blue-700" },
        { title: t.tools.removeWatermark, slug: "remove-watermark", description: t.tools.removeWatermarkDesc, icon: Eraser, color: "bg-cyan-600" },
      ]
    },
    {
      category: t.toolsPage.categorySecurity,
      slug: "Security",
      description: t.toolsPage.descSecurity,
      tools: [
        { title: t.tools.lock, slug: "lock-pdf", description: t.tools.lockDesc, icon: Lock, color: "bg-slate-700" },
        { title: t.tools.unlock, slug: "unlock-pdf", description: t.tools.unlockDesc, icon: Unlock, color: "bg-slate-500" },
      ]
    },
    {
      category: "Utilidades",
      slug: "Utilities",
      description: "Herramientas adicionales, de compresión y productividad.",
      tools: [
        { title: t.tools.comparePdf, slug: "compare-pdf", description: t.tools.comparePdfDesc, icon: FileSearch, color: "bg-indigo-700" },
        { title: t.tools.compressPdf, slug: "compress-pdf", description: t.tools.compressDesc, icon: FileDown, color: "bg-emerald-600" },
        { title: "Extracción a Excel", slug: "expense-report", description: "Extrae XML, PDF y Tickets en un Excel tabulado", icon: FileSpreadsheet, color: "bg-green-600" },
      ]
    }
  ];

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("All");
    }
  }, [searchParams]);

  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    if (paymentStatus === "success") {
      update();
    }
  }, [paymentStatus, update]);

  const categories = [
    { name: t.toolsPage.categoryAll, value: "All" },
    ...localizedCategorizedTools.map(c => ({ name: c.category, value: c.slug }))
  ];

  const filteredCategories = activeTab === "All" 
    ? localizedCategorizedTools 
    : localizedCategorizedTools.filter(c => c.slug === activeTab);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {paymentStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-6 glass border border-teal-500/30 bg-teal-500/5 rounded-3xl flex items-center gap-4 text-left shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Star className="w-8 h-8 text-teal-600 fill-teal-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{t.toolsPage.successTitle}</h3>
                <p className="text-secondary">{t.toolsPage.successDesc}</p>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {t.toolsPage.title} <span className="text-primary">{t.toolsPage.titleAccent}</span>
            </motion.h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg mb-10">
              {t.toolsPage.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveTab(cat.value);
                    if (cat.value === "All") {
                        router.push('/tools');
                    } else {
                        router.push(`/tools?tab=${cat.value}`);
                    }
                  }}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === cat.value 
                      ? "bg-primary text-white shadow-lg shadow-blue-500/30" 
                      : "bg-accent hover:bg-accent/80 text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-20">
            {filteredCategories.map((cat) => (
              <div key={cat.category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10 text-left">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <span className="w-1 h-8 bg-primary rounded-full" />
                    {cat.category}
                  </h2>
                  <p className="text-secondary">{cat.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.tools.map((tool, idx) => (
                    <PDFToolCard
                      key={tool.slug}
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon as any}
                      color={tool.color}
                      slug={tool.slug}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ToolsPage() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">{t.toolsPage.categoryAll}...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
