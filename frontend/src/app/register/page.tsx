"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Mail, Lock, Loader2, ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

import { useI18n } from "@/lib/i18n/I18nContext";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!recaptchaToken) {
        setError(lang === 'es' ? "Por favor completa el captcha." : "Please complete the captcha.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/register-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, lang, recaptchaToken }),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          throw new Error(lang === 'es' ? "Ocurrió un error en el servidor. Inténtalo más tarde." : "Server error. Please try again later.");
        }
        throw new Error(errorData.message || (lang === 'es' ? "Ocurrió un error al registrarse" : "Error while registering"));
      }

      const data = await res.json();

      const loginRes = await signIn("credentials", {
        email,
        password,
        recaptchaToken: "registro-inmediato",
        redirect: false,
      });

      if (!loginRes?.error) {
        router.push("/activate-premium");
        router.refresh();
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <div className="glass p-8 sm:p-10 rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mb-32" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400">
                  {t.auth.registerTitle}
                </h1>
                <p className="text-secondary mt-3">
                  {t.auth.registerDesc}
                </p>
              </div>

              {error && (
                <div className="p-4 mb-6 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary ml-1">{t.auth.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-accent hover:bg-accent/80 focus:bg-accent focus:ring-2 focus:ring-primary/50 text-foreground rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-muted-foreground"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary ml-1">{t.auth.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-accent hover:bg-accent/80 focus:bg-accent focus:ring-2 focus:ring-primary/50 text-foreground rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-muted-foreground"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-2 mt-2">
                    {lang === 'es' ? 'Debe tener al menos 6 caracteres.' : 'Must be at least 6 characters.'}
                  </p>
                </div>

                <div className="flex justify-center py-2">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    onChange={(val) => setRecaptchaToken(val)}
                    theme="light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{t.auth.registerBtn}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-[1px] flex-grow bg-border" />
                <span className="text-xs text-secondary font-medium uppercase tracking-widest">{t.auth.orJoin}</span>
                <div className="h-[1px] flex-grow bg-border" />
              </div>

              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full py-4 px-8 bg-white hover:bg-white/95 text-slate-900 border border-slate-200 font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 active:scale-95 duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <div className="mt-8 text-center text-sm text-secondary">
                {t.auth.hasAccount}{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                  {t.auth.loginLink}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
