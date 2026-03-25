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
            className="bg-white max-w-sm w-full p-8 rounded-[2rem] border border-border shadow-2xl text-center relative overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary fill-primary animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-black mb-3 tracking-tight">
                {t.limitModal.title}
              </h2>
              
              <p className="text-secondary mb-6 leading-relaxed text-sm">
                {t.limitModal.desc}
              </p>

              {resetTime > 0 && (
                <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl inline-block w-full">
                  <div className="flex items-center justify-center gap-2 text-primary mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t.limitModal.resetIn}</span>
                  </div>
                  <div className="text-3xl font-black font-mono tracking-wider">
                    {timeLeft || "00:00:00"}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href={isLoggedIn ? "/activate-premium" : "/unlimited-access"}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group text-sm"
                >
                  {t.limitModal.btnUpgrade}
                  <Zap className="w-4 h-4 fill-current" />
                </Link>
                
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-accent/50 text-accent-foreground rounded-xl font-semibold hover:bg-accent transition-all text-sm flex items-center justify-center gap-2 group"
                >
                  {t.limitModal.btnFree}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
