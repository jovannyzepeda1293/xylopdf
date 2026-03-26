"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  User, 
  Lock, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  ChevronRight,
  LogOut,
  XCircle,
  CheckCircle2
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function CuentaPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { t, lang } = useI18n();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword !== confirmPassword) {
      setPassMessage({ type: "error", text: lang === 'es' ? "Las contraseñas nuevas no coinciden" : "New passwords don't match" });
      return;
    }

    if (newPassword.length < 6) {
      setPassMessage({ type: "error", text: lang === 'es' ? "La nueva contraseña debe tener al menos 6 caracteres" : "New password must be at least 6 characters" });
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPassMessage({ type: "error", text: data.error || (lang === 'es' ? "Error al actualizar" : "Update error") });
      } else {
        setPassMessage({ type: "success", text: t.account.successPass });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setPassMessage({ type: "error", text: "Error" });
    } finally {
      setPassLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (res.ok) {
        setPassMessage({ type: "success", text: lang === 'es' ? "Suscripción cancelada" : "Subscription canceled" });
        setCancelModal(false);
        setTimeout(async () => {
          await update();
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || "Error");
      }
    } catch (error) {
      console.error(error);
      alert("Error");
    } finally {
      setCancelLoading(false);
    }
  };

  const getRenewalDateStr = () => {
    if (!session?.user?.expiresAt) return "";
    const date = new Date(session.user.expiresAt);
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 -z-10 w-[40%] h-[40%] bg-teal-500/5 blur-[100px] rounded-full" />

        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t.account.title}</h1>
            <p className="text-secondary">{lang === 'es' ? 'Gestiona tu perfil y suscripción premium.' : 'Manage your profile and premium subscription.'}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-3xl border border-border/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{t.account.profile}</p>
                    <h3 className="font-bold truncate text-sm">{session?.user?.name || (lang === 'es' ? "Usuario" : "User")}</h3>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-secondary font-medium">{t.auth.email}</p>
                  <p className="text-sm font-semibold truncate bg-accent/30 p-2 rounded-lg border border-border/30">
                    {session?.user?.email}
                  </p>
                  <p className="text-[10px] text-secondary/60 pt-1 italic">{lang === 'es' ? '* El correo no es editable.' : '* Email is not editable.'}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-3xl border border-border/50 bg-gradient-to-br from-accent/50 to-background"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">{t.account.subscription}</h3>
                </div>

                {session?.user?.subscriptionActive ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-teal-500 bg-teal-500/10 px-3 py-1.5 rounded-full w-fit text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      {lang === 'es' ? 'PREMIUM ACTIVO' : 'PREMIUM ACTIVE'}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-secondary font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {session.user.canceled ? t.account.premiumUntil : t.account.nextRenewal}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {getRenewalDateStr()}
                      </p>
                    </div>
                    {!session.user.canceled && (
                      <button
                        onClick={() => setCancelModal(true)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 pt-2"
                      >
                        <XCircle className="w-3 h-3" /> {t.account.cancelSub}
                      </button>
                    )}
                    {session.user.canceled && (
                      <p className="text-[10px] text-amber-500 font-medium italic">
                        {t.account.canceledMsg}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-secondary bg-accent px-3 py-1.5 rounded-full w-fit text-xs font-bold">
                      <AlertCircle className="w-4 h-4" />
                      {t.account.noSub}
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">
                      {lang === 'es' ? 'Actualiza a premium para obtener procesos ilimitados y soporte prioritario.' : 'Upgrade to premium to get unlimited processing and priority support.'}
                    </p>
                    <button
                      onClick={() => router.push("/unlimited-access")}
                      className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      {t.navbar.unlimitedAccess}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 rounded-[2rem] border border-border/50 h-full"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">{t.account.changePass}</h3>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider px-1">
                        {t.account.oldPass}
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-accent/50 border border-border/50 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider px-1">
                          {t.account.newPass}
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-accent/50 border border-border/50 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider px-1">
                          {t.account.confirmNewPass}
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-accent/50 border border-border/50 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {passMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn(
                          "flex items-center gap-2 p-4 rounded-2xl text-sm font-bold",
                          passMessage.type === "success" ? "bg-teal-500/10 text-teal-500" : "bg-red-500/10 text-red-500"
                        )}
                      >
                        {passMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {passMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={passLoading}
                    className="w-full bg-foreground text-background py-4 rounded-2xl font-bold hover:bg-foreground/90 transition-all active:scale-[0.98] focus:ring-4 focus:ring-foreground/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {passLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t.account.updateBtn}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {cancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md p-10 rounded-[2.5rem] border border-border shadow-2xl bg-white dark:bg-zinc-900 z-50"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">{t.account.cancelModalTitle}</h2>
              <p className="text-secondary text-center text-sm leading-relaxed mb-8">
                {t.account.cancelModalDesc} <span className="text-foreground font-bold">{getRenewalDateStr()}</span>. {lang === 'es' ? 'Después de esa fecha, volverás al plan gratuito.' : 'After that date, you will return to the free plan.'}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  {cancelLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t.account.cancelModalConfirm
                  )}
                </button>
                <button
                  onClick={() => setCancelModal(false)}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-bold hover:bg-accent/80 transition-all"
                >
                  {t.account.cancelModalBack}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
