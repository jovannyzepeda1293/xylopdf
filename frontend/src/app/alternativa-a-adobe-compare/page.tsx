"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Check, X, Shield, Zap, DollarSign, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AlternativaAdobe() {
  const comparison = [
    { feature: "Precio", xylo: "Gratis / Desde $5", adobe: "$19.99/mes" },
    { feature: "Velocidad", xylo: "Instantáneo (IA)", adobe: "Medio" },
    { feature: "Facilidad", xylo: "Sube y Listo", adobe: "Software Complejo" },
    { feature: "Sin Registro", xylo: <Check className="text-green-500 mx-auto" />, adobe: <X className="text-red-500 mx-auto" /> },
    { feature: "Basado en Web", xylo: <Check className="text-green-500 mx-auto" />, adobe: <X className="text-red-500 mx-auto" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Comparison Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
          
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                La mejor alternativa para comparar PDFs que <span className="text-red-500 strike">Adobe</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto">
                ¿Cansado de suscripciones caras y software pesado? Xylo PDF ofrece la misma potencia de comparación que Acrobat, pero más rápido, más barato y sin necesidad de instalación.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                 <Link href="/tools/compare-pdf" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
                    Probar Gratis Ahora
                 </Link>
                 <span className="text-slate-500 font-medium">No requiere tarjeta de crédito</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Table Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Xylo PDF vs Adobe Acrobat</h2>
            
            <div className="glass rounded-[2rem] overflow-hidden border border-border shadow-2xl">
              <div className="grid grid-cols-3 bg-accent/10 border-b border-border">
                 <div className="p-6 font-bold">Característica</div>
                 <div className="p-6 font-bold text-center text-primary">Xylo PDF</div>
                 <div className="p-6 font-bold text-center text-slate-400">Adobe Acrobat</div>
              </div>
              {comparison.map((row, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-border/50 last:border-0 hover:bg-accent/5 transition-colors">
                  <div className="p-6 font-medium text-secondary">{row.feature}</div>
                  <div className="p-6 text-center font-bold text-primary">{row.xylo}</div>
                  <div className="p-6 text-center text-slate-500">{row.adobe}</div>
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-center text-secondary italic text-sm">
              * Datos basados en el plan Adobe Acrobat Pro DC y la versión web de Xylo PDF.
            </p>
          </div>
        </section>

        {/* Why Xylo Section */}
        <section className="py-24 bg-accent/5">
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
              <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <Zap className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Más Rápido</h3>
                 <p className="text-secondary">Sin tiempos de carga pesados. Nuestro motor basado en la nube procesa archivos en milisegundos.</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Privacidad</h3>
                 <p className="text-secondary">No almacenamos tus datos personales. Tus archivos se auto-destruyen tras la comparación.</p>
              </div>
              <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <DollarSign className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Ahorro</h3>
                 <p className="text-secondary">Paga solo por lo que usas o disfruta de nuestra herramienta gratuita ilimitada.</p>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-32">
           <div className="max-w-5xl mx-auto px-6 text-center">
              <div className="p-16 rounded-[4rem] bg-gradient-to-br from-primary to-blue-600 text-white shadow-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                 <h2 className="text-4xl md:text-6xl font-black mb-8">Haz el cambio hoy 🚀</h2>
                 <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                    Únete a miles de usuarios que han dejado atrás Adobe por una experiencia más moderna y veloz.
                 </p>
                 <Link href="/tools/compare-pdf" className="bg-white text-primary px-12 py-6 rounded-3xl font-black text-2xl hover:scale-110 transition-transform shadow-2xl inline-flex items-center gap-4">
                    Comparar Ahora
                    <ArrowRight className="w-8 h-8" />
                 </Link>
              </div>
           </div>
        </section>
        
        {/* SEO Comparison */}
        <section className="py-16 border-t border-border/10">
            <div className="max-w-4xl mx-auto px-6 prose prose-slate">
                <h2>¿Por qué Xylo PDF es la mejor alternativa a Adobe Acrobat?</h2>
                <p>Adobe Acrobat ha sido el estándar durante años, pero es una herramienta pesada y costosa para una tarea tan específica como <strong>comparar archivos PDF</strong>.</p>
                <p>Xylo PDF nace como una solución "Cloud-Native" que prioriza la <strong>velocidad</strong> y la <strong>simplicidad</strong>. Nuestra tecnología de detección de diferencias es altamente precisa y no requiere formación previa para ser utilizada.</p>
                <h3>Diferencias clave:</h3>
                <ul>
                    <li><strong>Accesibilidad:</strong> Accede desde cualquier dispositivo sin instalar apps.</li>
                    <li><strong>Precio:</strong> Adobe te obliga a suscripciones anuales; Xylo PDF es gratuito o bajo demanda.</li>
                    <li><strong>Tecnología:</strong> Usamos algoritmos de IA optimizados para la web.</li>
                </ul>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
