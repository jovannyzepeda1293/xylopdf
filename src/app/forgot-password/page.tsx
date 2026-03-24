"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Mail, Loader2, Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function RecuperarPage() {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch {
      setError(lang === 'es' ? "Error de conexión al servidor." : "Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass p-10 rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden">
            <Link 
              href="/login" 
              className="absolute top-8 left-8 text-secondary hover:text-foreground transition-colors flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.auth.forgotBackSimple}</span>
            </Link>

            <div className="text-center mt-10 mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold italic tracking-tight">{t.auth.forgot}</h1>
              <p className="text-secondary mt-3 text-sm leading-relaxed">
                {t.auth.forgotSubtitle}
              </p>
            </div>

            {message && (
              <div className="p-4 mb-8 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl text-center">
                {message}
              </div>
            )}

            {error && (
              <div className="p-4 mb-8 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-center">
                {error}
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">{t.auth.forgotEmailLabel}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-accent/30 hover:bg-accent/50 focus:bg-accent focus:ring-2 focus:ring-primary/40 text-foreground rounded-2xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-muted-foreground border border-transparent focus:border-primary/20"
                      placeholder={t.auth.forgotPlaceholder}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:grayscale active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{t.auth.forgotBtn}</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            {message && (
              <Link
                href="/login"
                className="block w-full text-center py-4 bg-accent/30 hover:bg-accent/50 text-foreground rounded-xl transition-all font-bold"
              >
                {t.auth.forgotBack}
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
