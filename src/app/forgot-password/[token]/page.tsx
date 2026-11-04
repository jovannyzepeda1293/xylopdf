"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Lock, Loader2, ArrowRight, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Las contraseñas no coinciden");
      return;
    }
    
    if (password.length < 6) {
      setStatus("error");
      setMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al restablecer contraseña");
      }

      setStatus("success");
      setMessage(data.message);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 3000);
      
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <KeyRound className="w-8 h-8 text-orange-500" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                  Nueva Contraseña
                </h1>
                <p className="text-secondary mt-3">
                  Ingresa tu nueva clave de acceso de XyloPDF.
                </p>
              </div>

              {status === "error" && (
                <div className="p-4 mb-6 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-center">
                  {message}
                </div>
              )}
              
              {status === "success" && (
                <div className="p-4 mb-6 text-sm text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-xl text-center">
                  {message}
                  <p className="mt-2 text-xs">Redirigiendo al inicio de sesión...</p>
                </div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary ml-1">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-accent hover:bg-accent/80 focus:bg-accent focus:ring-2 focus:ring-orange-500/50 text-foreground rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-muted-foreground"
                        placeholder="••••••••"
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary ml-1">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-secondary" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-accent hover:bg-accent/80 focus:bg-accent focus:ring-2 focus:ring-orange-500/50 text-foreground rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-muted-foreground"
                        placeholder="••••••••"
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Actualizar contraseña</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-8 text-center text-sm text-secondary">
                <Link href="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
