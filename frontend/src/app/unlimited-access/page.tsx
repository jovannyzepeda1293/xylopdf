"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Infinity as InfinityIcon, ArrowRight, Star, Rocket, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AccesoIlimitadoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang, t } = useI18n();
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
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-[50%] h-[50%] bg-teal-500/5 blur-[120px] rounded-full" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
            >
              <Star className="w-4 h-4 fill-primary" />
              {lang === 'es' ? 'EL SIGUIENTE NIVEL' : 'THE NEXT LEVEL'}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text"
            >
              {t.premium.title.split('potencial')[0]}<span className="text-primary italic px-2">{lang === 'es' ? 'potencial' : 'potential'}</span>{t.premium.title.split('potencial')[1]}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              {t.premium.subtitle}
            </motion.p>
          </div>

          <motion.div
            id="pricing-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-[3.5rem] p-8 md:p-14 border border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 via-background to-background flex flex-col md:flex-row items-center gap-12 overflow-hidden relative mb-20"
          >
            <div className="flex-grow w-full text-center md:text-left">
                <AnimatePresence mode="wait">
                  {success ? (
                     <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-10 flex flex-col items-center md:items-start text-center md:text-left space-y-6"
                      >
                        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-teal-500/50">
                          <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black">{lang === 'es' ? '¡Bienvenido a Premium!' : 'Welcome to Premium!'}</h3>
                        <p className="text-secondary max-w-[300px]">
                          {lang === 'es' ? 'Tu suscripción se ha activado correctamente. Redirigiendo...' : 'Your subscription has been successfully activated. Redirecting...'}
                        </p>
                      </motion.div>
                  ) : status === "unauthenticated" ? (
                    <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h2 className="text-4xl font-extrabold mb-4">{lang === 'es' ? 'Empieza hoy mismo' : 'Start today'}</h2>
                      <p className="text-secondary text-lg mb-8 max-w-md mx-auto md:mx-0">
                        {lang === 'es' ? 'Únete a miles de usuarios que ya optimizan su flujo de trabajo con XyloPDF.' : 'Join thousands of users already optimizing their workflow with XyloPDF.'} {lang === 'es' ? 'Por solo' : 'For only'} <span className="text-foreground font-bold">{t.premium.price} {t.premium.currency}</span>.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                          href="/register?callbackUrl=/unlimited-access"
                          className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
                        >
                          {t.premium.btnCreate}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/login?callbackUrl=/unlimited-access"
                          className="px-10 py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border flex items-center justify-center"
                        >
                          {t.premium.btnHasAccount}
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                       <div className="mb-8">
                          <h2 className="text-4xl font-black mb-4">{t.premium.plan}</h2>
                          <p className="text-secondary">
                             {lang === 'es' ? 'Estás a un paso de la libertad total. Activa tu suscripción de forma segura con Stripe.' : 'You are one step away from total freedom. Activate your subscription securely with Stripe.'}
                          </p>
                       </div>
                       <div className="bg-background/40 p-6 md:p-8 rounded-[2.5rem] shadow-inner">
                          <button
                            onClick={handleCheckout}
                            disabled={isRedirecting}
                            className="w-full max-w-md py-6 bg-primary text-primary-foreground rounded-2xl font-black text-2xl hover:scale-[1.03] transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:grayscale"
                          >
                            {isRedirecting ? (
                              <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                              <>
                                <CreditCard className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                                {lang === 'es' ? 'Suscribirse Ahora' : 'Subscribe Now'}
                              </>
                            )}
                          </button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <div className="w-full md:w-[350px] flex-shrink-0 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse pointer-events-none" />
              <div className="relative glass p-10 w-full rounded-[3rem] border border-white/10 shadow-inner flex flex-col items-center gap-8">
                 <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-6xl font-black">{t.premium.price}</span>
                        <span className="text-xl text-secondary">{t.premium.currency}</span>
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-2">Premium Member</p>
                 </div>
                 
                 <ul className="space-y-4 w-full text-left">
                    {[
                      t.premium.feat1,
                      t.premium.featExtraTitle,
                      t.premium.featExtraAd,
                      lang === 'es' ? "Soporte Prioritario" : "Priority Support"
                    ].map((f, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-teal-500" />
                        </div>
                        {f}
                      </li>
                    ))}
                 </ul>

              </div>
            </div>

            {/* Decorative Lights */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
          </motion.div>

          {/* Cards section moved here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { 
                icon: InfinityIcon, 
                title: lang === 'es' ? "Conversiones Ilimitadas" : "Unlimited Conversions", 
                desc: t.premium.feat1,
                color: "bg-teal-500"
              },
              { 
                icon: Zap, 
                title: lang === 'es' ? "Velocidad Ultra" : "Ultra Speed", 
                desc: t.premium.feat2,
                color: "bg-amber-500"
              },
              { 
                icon: Shield, 
                title: lang === 'es' ? "Privacidad Total" : "Total Privacy", 
                desc: t.premium.feat4,
                color: "bg-blue-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/30 transition-all hover:translate-y-[-5px]"
              >
                <div className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
