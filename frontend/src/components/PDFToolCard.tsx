"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

interface PDFToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  slug: string;
  delay?: number;
}

export default function PDFToolCard({ title, description, icon: Icon, color, slug, delay = 0 }: PDFToolCardProps) {
  const { t } = useI18n();
  const targetUrl = slug.startsWith("/") ? slug : `/tools/${slug}`;
  
  return (
    <Link href={targetUrl}>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group relative glass p-8 rounded-[2rem] border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
    >
      {/* Accent Background Glow */}
      <div className={cn(
        "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
        color
      )} />

      <div className={cn(
        "p-4 rounded-2xl w-fit mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300",
        color.replace('bg-', 'bg-').replace('/20', '') // Simplistic color mapping
      )}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-secondary text-sm leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
        {t.tools.useTool} →
      </div>
    </motion.div>
    </Link>
  );
}
