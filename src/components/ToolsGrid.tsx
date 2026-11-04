"use client";

import { 
  Merge, 
  Split, 
  RotateCw, 
  Trash2, 
  FileSearch, 
  Eraser, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Image, 
  Lock, 
  Unlock, 
  ScanLine,
  ArrowRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import PDFToolCard from "./PDFToolCard";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ToolsGrid() {
  const { t } = useI18n();

  const tools = [
    {
      title: t.tools.unir,
      slug: "merge-pdf",
      category: "Edición",
      description: t.tools.unirDesc,
      icon: Merge,
      color: "bg-blue-600",
    },
    {
      title: t.tools.dividir,
      slug: "split-pdf",
      category: "Edición",
      description: t.tools.dividirDesc,
      icon: Split,
      color: "bg-indigo-600",
    },
    {
      title: t.tools.girar,
      slug: "rotate-pdf",
      category: "Edición",
      description: t.tools.girarDesc,
      icon: RotateCw,
      color: "bg-purple-600",
    },
    {
      title: t.tools.deletePages,
      slug: "delete-pages",
      category: "Edición",
      description: t.tools.eliminarDesc,
      icon: Trash2,
      color: "bg-red-600",
    },
    {
      title: t.tools.removeWatermark,
      slug: "remove-watermark",
      category: "Optimización",
      description: t.tools.removeWatermarkDesc,
      icon: Eraser,
      color: "bg-cyan-600",
    },
    {
      title: "PDF a Word",
      slug: "pdf-to-word",
      category: "Conversión",
      description: t.tools.wordDesc,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: t.tools.ocr,
      slug: "ocr-to-pdf",
      category: "Conversión",
      description: t.tools.ocrDesc,
      icon: ScanLine,
      color: "bg-sky-600",
    },
    {
      title: t.tools.lock,
      slug: "lock-pdf",
      category: "Seguridad",
      description: t.tools.lockDesc,
      icon: Lock,
      color: "bg-slate-700",
    },
  ];

  return (
    <section id="tools" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t.tools.title}
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-lg">
            {t.tools.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.slice(0, 7).map((tool, index) => (
            <PDFToolCard
              key={tool.slug}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              slug={tool.slug}
              delay={index * 0.05}
            />
          ))}
          
          {/* Discovery Card */}
          <PDFToolCard
            title={t.tools.more}
            description={t.tools.moreDesc}
            icon={ArrowRight}
            color="bg-primary/20 scale-105 border-primary/30"
            slug="/tools"
            delay={0.4}
          />
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 px-10 py-4 bg-accent hover:bg-accent/80 rounded-2xl font-bold border border-border transition-all"
          >
            {t.tools.viewAll}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
