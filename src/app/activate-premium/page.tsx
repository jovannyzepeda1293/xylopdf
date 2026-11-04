"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Rocket, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ActivarPremiumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, lang } = useI18n();
  const [success, setSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      setSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.subscriptionActive && !success) {
      router.push("/tools");
    }
  }, [session, router, success]);

  if (status === "loading" || (session?.user?.subscriptionActive && !success)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleCheckout = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang })
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || (lang === 'es' ? "Error al iniciar el pago" : "Error starting payment"));
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error(error);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        {/* Background Sparkle Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-[400px] bg-primary/10 blur-[150px] rounded-full" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-8">
              <Rocket className="w-12 h-12 text-primary animate-bounce-slow" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              {t.premium.title.split('potencial')[0]}
              <span className="text-primary italic px-2">{lang === 'es' ? 'potencial' : 'potential'}</span>
              {t.premium.title.split('potencial')[1]}
            </h1>
            <p className="text-xl text-secondary/80 max-w-xl mx-auto">
              {t.premium.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side: Features */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-10"
            >
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-500" />
                {t.premium.featuresTitle}
              </h2>

              <ul className="space-y-8">
                {[
                  t.premium.feat1,
                  t.premium.feat2,
                  t.premium.feat3,
                  t.premium.feat4
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-start gap-5 group"
                  >
                    <div className="mt-1 w-8 h-8 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary transition-all group-hover:text-primary-foreground">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-lg text-secondary font-medium tracking-wide pt-0.5">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right side: Payment Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="glass p-8 md:p-12 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(var(--primary-rgb),0.3)] relative overflow-hidden bg-gradient-to-br from-primary/10 via-background/80 to-background/50 backdrop-blur-3xl">

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-20 flex flex-col items-center text-center space-y-6"
                    >
                      <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-teal-500/50">
                        <CheckCircle2 className="w-14 h-14" />
                      </div>
                      <h3 className="text-3xl font-black">{lang === 'es' ? '¡Bienvenido a Premium!' : 'Welcome to Premium!'}</h3>
                      <p className="text-secondary max-w-[250px]">
                        {lang === 'es' ? 'Tu suscripción se ha activado correctamente.' : 'Your subscription has been successfully activated.'}
                      </p>
                      <Loader2 className="w-8 h-8 animate-spin text-primary mt-4" />
                    </motion.div>
                  ) : status === "unauthenticated" ? (
                    <motion.div
                      key="auth-required"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-10 flex flex-col items-center text-center space-y-8"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Rocket className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black mb-3">
                          {lang === 'es' ? 'Casi listo...' : 'Almost ready...'}
                        </h3>
                        <p className="text-secondary text-sm max-w-[300px] mx-auto">
                          {lang === 'es'
                            ? 'Necesitas iniciar sesión o crear una cuenta para activar tu suscripción Premium.'
                            : 'You need to log in or create an account to activate your Premium subscription.'}
                        </p>
                      </div>
                      <div className="w-full space-y-4">
                        <button
                          onClick={() => router.push("/login?callbackUrl=/activate-premium")}
                          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                        >
                          {t.auth.login}
                        </button>
                        <button
                          onClick={() => router.push("/login?tab=register&callbackUrl=/activate-premium")}
                          className="w-full py-4 bg-white/5 border border-primary/20 text-foreground rounded-2xl font-bold hover:bg-white/10 transition-all"
                        >
                          {t.auth.register}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      {/* Original Premium Form Header */}
                      <div className="mb-10 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/30">
                          {t.premium.plan}
                        </div>
                        <div className="flex items-baseline justify-center lg:justify-start gap-2 mt-4">
                          <span className="text-7xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {t.premium.price}
                          </span>
                          <span className="text-2xl text-secondary font-bold">{t.premium.currency.split('/')[0]}</span>
                          <span className="text-secondary">/{t.premium.currency.split('/')[1]}</span>
                        </div>
                        <p className="text-sm text-secondary/60 mt-4 italic">
                          {lang === 'es' ? 'Cancela en cualquier momento.' : 'Cancel at any time.'}
                        </p>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-background/20 p-8 rounded-[2.5rem] shadow-inner">
                          <button
                            onClick={handleCheckout}
                            disabled={isRedirecting}
                            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:scale-[1.03] transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:grayscale"
                          >
                            {isRedirecting ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                {lang === 'es' ? 'Suscribirse Ahora' : 'Subscribe Now'}
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                          <p className="text-[10px] text-secondary/40 text-center uppercase tracking-widest">
                            {t.premium.secure.replace('Conekta', 'Stripe')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative Lights */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
