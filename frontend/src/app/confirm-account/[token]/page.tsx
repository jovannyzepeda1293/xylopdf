"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ConfirmarCuentaPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { token } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [called, setCalled] = useState(false);

  useEffect(() => {
    if (!token || called) return;

    const confirm = async () => {
      setCalled(true);
      try {
        const res = await fetch(`/api/auth/confirm?token=${token}`);
        if (res.ok) {
          setStatus("success");
          
          const destination = "/activate-premium";
          
          setTimeout(() => {
            router.push(destination);
          }, 4000);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    confirm();
  }, [token, router, sessionStatus, called]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass p-12 rounded-[2.5rem] border border-border/50 shadow-2xl">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-6">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <h1 className="text-2xl font-bold">{t.auth.confirmTitle}</h1>
                <p className="text-secondary">{t.auth.confirmSubtitle}</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold">{t.auth.successTitle}</h1>
                <p className="text-secondary">
                  {t.auth.successSubtitle}
                </p>
                <p className="text-xs text-secondary/60">{t.auth.successRedirect}</p>
                <Link 
                  href="/activate-premium" 
                  className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                >
                  {t.auth.successBtn}
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-red-400">{t.auth.errorTitle}</h1>
                <p className="text-secondary">
                  {t.auth.errorSubtitle}
                </p>
                <Link 
                  href="/" 
                  className="mt-4 px-8 py-3 bg-accent text-foreground font-bold rounded-xl border border-border hover:bg-accent/80 transition-all"
                >
                  {t.auth.errorBtn}
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
