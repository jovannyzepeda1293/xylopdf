"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, Loader2, Send, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ConfirmationGate() {
  const { data: session, status } = useSession();
  const { t, lang } = useI18n();
  const [showModal, setShowModal] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Solo mostramos si está logueado y NO confirmado
    if (status === "authenticated" && session?.user && (session.user as any).isConfirmed === false) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-confirmation", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(t.auth.gateSuccess);
        setCooldown(30); // 30 segundos de bloqueo
      } else {
        setMessage(t.auth.gateError + " " + (data.message || ""));
      }
    } catch {
      setMessage(t.auth.gateConnError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg glass border border-primary/20 shadow-2xl rounded-[3rem] p-10 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-bold mb-4 tracking-tight">{t.auth.gateTitle}</h2>
            <p className="text-secondary leading-relaxed mb-8">
              {t.auth.gateSubtitle}
              <span className="block font-bold mt-2 text-foreground">{session?.user?.email}</span>
            </p>

            {message && (
              <div className={`p-4 mb-8 text-sm rounded-2xl border ${message.includes(t.auth.gateSuccess.split('.')[0]) ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="w-full py-4 px-8 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-3 overflow-hidden relative group active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : cooldown > 0 ? (
                  <>
                    <Clock className="w-5 h-5" />
                    <span>{t.auth.gateRetry} {cooldown}s</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>{t.auth.gateResend}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-8 bg-accent/30 hover:bg-accent/50 text-foreground font-medium rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{t.auth.gateAlreadyDone}</span>
              </button>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full py-3 px-8 bg-transparent hover:bg-red-500/10 text-secondary hover:text-red-400 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.auth.gateLogout}</span>
              </button>
            </div>

            <p className="mt-8 text-xs text-secondary/60">
              {t.auth.gateNoEmail}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
