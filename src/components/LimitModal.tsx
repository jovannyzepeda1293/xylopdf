"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Zap, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface LimitModalProps {
  show: boolean;
  onClose: () => void;
  resetTime?: number; // milliseconds
  isLoggedIn: boolean;
}

export default function LimitModal({ show, onClose, resetTime = 0, isLoggedIn }: LimitModalProps) {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!show || resetTime <= 0) return;

    let totalMs = resetTime;
    const interval = setInterval(() => {
      totalMs -= 1000;
      if (totalMs <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
      } else {
        const hours = Math.floor(totalMs / 3600000);
        const minutes = Math.floor((totalMs % 3600000) / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [show, resetTime]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass max-w-lg w-full p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 blur-[80px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-secondary hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/10">
                <Star className="w-12 h-12 text-primary fill-primary animate-pulse" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                {t.limitModal.title}
              </h2>
              
              <p className="text-secondary mb-8 leading-relaxed text-lg">
                {t.limitModal.desc}
              </p>

              {resetTime > 0 && (
                <div className="mb-10 p-6 glass border border-primary/20 rounded-3xl bg-primary/5 inline-block">
                  <div className="flex items-center justify-center gap-3 text-primary mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t.limitModal.resetIn}</span>
                  </div>
                  <div className="text-4xl font-black font-mono">
                    {timeLeft || "00:00:00"}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Link
                  href={isLoggedIn ? "/activate-premium" : "/unlimited-access"}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
                >
                  {t.limitModal.btnUpgrade}
                  <Zap className="w-5 h-5 fill-current" />
                </Link>
                
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border flex items-center justify-center gap-2 group"
                >
                  {t.limitModal.btnFree}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-slate-200" />
                  ))}
                </div>
                <p className="text-xs text-secondary italic">
                  {t.limitModal.usersJoined}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
