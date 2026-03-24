"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Merge, Split, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function Hero() {
  const { t } = useI18n();
  
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary font-semibold text-sm mb-8 animate-float">
            <Sparkles className="w-4 h-4" />
            <span>{t.hero.tag}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-primary bg-clip-text text-transparent">
            {t.hero.title1} <br className="hidden md:block" />
            <span className="text-primary italic">{t.hero.title2}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-secondary mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/unlimited-access" className="w-full sm:w-auto px-8 py-4 bg-primary text-secondary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
              {t.hero.btnStart}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#tools" className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-bold text-lg hover:bg-accent/80 transition-all border border-border flex items-center justify-center">
              {t.hero.btnDiscover}
            </a>
          </div>
        </motion.div>

        {/* Decorative Floating Icons instead of Uploader */}
        <div className="relative mt-20 h-24 max-w-lg mx-auto hidden md:block">
          {[
            { Icon: FileText, color: "text-blue-500", delay: 0, x: -150 },
            { Icon: Merge, color: "text-purple-500", delay: 0.2, x: -50 },
            { Icon: Split, color: "text-orange-500", delay: 0.4, x: 50 },
            { Icon: Shield, color: "text-green-500", delay: 0.6, x: 150 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: item.x }}
              transition={{ delay: item.delay + 0.5, type: "spring" }}
              className={cn("absolute left-1/2 -ml-6 p-4 glass rounded-2xl border border-white/10 animate-float", item.color)}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <item.Icon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
