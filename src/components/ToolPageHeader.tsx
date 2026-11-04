"use client";

import { motion } from "framer-motion";
import { LucideIcon, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

interface ToolPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function ToolPageHeader({ title, description, icon: Icon, color }: ToolPageHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="mb-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          {t.navbar.home || "Home"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/tools" className="hover:text-primary transition-colors">
          {t.navbar.tools || "Tools"}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className={`p-5 rounded-[2rem] ${color} shadow-2xl shadow-black/10`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-secondary max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
