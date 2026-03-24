"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { useI18n } from "@/lib/i18n/I18nContext";

export default function LoginPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(lang === 'es' ? "Credenciales inválidas. Verifica tu correo y contraseña." : "Invalid credentials. Please check your email and password.");
    } else {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.subscriptionActive) {
          router.push("/tools");
        } else {
          router.push("/activate-premium");
        }
        router.refresh();
      } catch (e) {
        router.push("/");
      }
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
                  {t.auth.welcomeTitle}
                </h1>
                <p className="text-secondary mt-3">
                  {t.auth.welcomeDesc}
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
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-secondary">{t.auth.password}</label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                      {t.auth.forgotPass}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-accent hover:bg-accent/80 focus:bg-accent focus:ring-2 focus:ring-primary/50 text-foreground rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-muted-foreground"
                      placeholder="••••••••"
                      required
                    />
                  </div>
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
                      <span>{t.auth.loginBtn}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-[1px] flex-grow bg-border" />
                <span className="text-xs text-secondary font-medium uppercase tracking-widest">{t.auth.or}</span>
                <div className="h-[1px] flex-grow bg-border" />
              </div>

              <button
                onClick={() => signIn("google", { callbackUrl: "/auth-redirect" })}
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
                {t.auth.noAccount}{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
                  {t.auth.registerLink}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
