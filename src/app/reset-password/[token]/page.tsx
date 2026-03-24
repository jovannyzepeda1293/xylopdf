"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function RestablecerPage() {
  const { t, lang } = useI18n();
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage(t.auth.resetMatchError);
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t.auth.resetLengthError);
      setStatus("error");
      return;
    }

    setErrorMessage("");
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setErrorMessage(data.message);
        setStatus("error");
      }
    } catch {
      setErrorMessage(lang === 'es' ? "Error de conexión al servidor." : "Server connection error.");
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass p-10 rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -ml-16 -mt-16" />
            
            <div className="relative z-10 text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold italic tracking-tight">{t.auth.resetTitle}</h1>
              <p className="text-secondary mt-3 text-sm italic">
                {t.auth.resetSubtitle}
              </p>
            </div>

            {status === "success" ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">{t.auth.resetSuccess}</h2>
                <p className="text-secondary">{t.auth.resetSuccessMsg}</p>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="w-full inline-block py-4 px-8 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    {t.auth.resetLoginBtn}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && (
                  <div className="p-4 mb-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">{t.auth.resetPasswordLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-accent/30 hover:bg-accent/50 focus:bg-accent focus:ring-2 focus:ring-primary/40 text-foreground rounded-2xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-muted-foreground border border-transparent focus:border-primary/20"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">{t.auth.resetConfirmLabel}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-accent/30 hover:bg-accent/50 focus:bg-accent focus:ring-2 focus:ring-primary/40 text-foreground rounded-2xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-muted-foreground border border-transparent focus:border-primary/20"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-95"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>{t.auth.resetBtn}</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link href="/login" className="text-xs text-secondary hover:text-foreground transition-all">
                    {t.auth.resetCancel}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
