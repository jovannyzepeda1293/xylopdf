"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, Zap, Shield, FileSearch, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CompararPdfOnline() {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Rápido y Eficiente",
      description: "Resultados en segundos gracias a nuestro motor de IA avanzado."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "100% Seguro",
      description: "Tus archivos se eliminan automáticamente después del procesamiento."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />,
      title: "Sin Registro",
      description: "Empieza a comparar de inmediato sin crear una cuenta."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
          
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary font-semibold text-sm mb-8">
                <Sparkles className="w-4 h-4" />
                <span>La herramienta más rápida del mercado</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                Compara dos <span className="text-primary italic">PDFs</span> en segundos 🔥
              </h1>
              <p className="text-xl text-secondary mb-10 leading-relaxed max-w-xl">
                Detecta cambios, adiciones y eliminaciones entre dos documentos PDF de forma visual y automática. Sin complicaciones, sin esperas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tools/compare-pdf" className="px-8 py-4 bg-primary text-secondary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Sube tus archivos ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {/* Mockup visual representativo */}
                <div className="p-4 bg-accent/30 flex items-center justify-between border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs text-secondary font-medium uppercase tracking-widest">Comparador Visual IA</div>
                </div>
                <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
                   <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                   <FileSearch className="w-20 h-20 text-primary/50" />
                   <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-4">
                      <div className="h-24 bg-white/5 rounded-xl border border-white/10 p-3 space-y-2">
                         <div className="w-3/4 h-2 bg-red-500/40 rounded" />
                         <div className="w-full h-2 bg-white/10 rounded" />
                         <div className="w-1/2 h-2 bg-white/10 rounded" />
                      </div>
                      <div className="h-24 bg-white/5 rounded-xl border border-white/10 p-3 space-y-2">
                         <div className="w-3/4 h-2 bg-green-500/40 rounded" />
                         <div className="w-full h-2 bg-white/10 rounded" />
                         <div className="w-full h-2 bg-white/10 rounded" />
                      </div>
                   </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl -z-10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 blur-3xl -z-10 rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-accent/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Por qué usar Xylo PDF?</h2>
              <p className="text-secondary text-lg">La mejor experiencia para comparar documentos PDF online.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((b, i) => (
                <div key={i} className="p-8 glass border border-white/5 rounded-3xl hover:bg-accent/10 transition-colors">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    {b.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                  <p className="text-secondary leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass p-12 rounded-[3rem] border border-primary/20 text-center relative overflow-hidden bg-primary/5">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FileSearch className="w-32 h-32 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Compara documentos PDF online gratis</h2>
              <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
                No pierdas tiempo revisando manualmente. Nuestra herramienta detecta cada pequeño cambio por ti.
              </p>
              <Link href="/tools/compare-pdf" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-bold text-xl shadow-xl shadow-blue-500/30 hover:scale-105 transition-all inline-flex items-center gap-3">
                Empezar comparación
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* SEO Content */}
        <section className="py-16 border-t border-border/10">
            <div className="max-w-4xl mx-auto px-6 prose prose-invert prose-p:text-secondary">
                <h2>La herramienta definitiva para comparar documentos PDF</h2>
                <p>Nuestra plataforma te permite <strong>comparar dos archivos PDF</strong> de forma rápida y gratuita. Es ideal para profesionales que necesitan verificar versiones de contratos, informes técnicos o cualquier documento legal.</p>
                <p>Con el <strong>comparador de PDF online</strong> de Xylo PDF, no necesitas instalar software pesado como Adobe Acrobat. Todo funciona desde tu navegador de forma segura y privada.</p>
                <h3>Cómo comparar PDF online paso a paso</h3>
                <ol>
                    <li>Sube el primer archivo PDF (original).</li>
                    <li>Sube el segundo archivo PDF (modificado).</li>
                    <li>Haz clic en "Comparar" y visualiza las diferencias resaltadas.</li>
                </ol>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
