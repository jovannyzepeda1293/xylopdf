"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Gavel, Scale, FileCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CompararContratos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-20 -z-10">
             <Image 
                src="/images/legal-compare.png" 
                alt="Comparación Legal" 
                fill 
                className="object-cover"
                priority
             />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-semibold text-sm mb-8">
                <Gavel className="w-4 h-4" />
                <span>Especial para Abogados y Notarías</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                Detecta cambios en <span className="text-primary">contratos</span> en segundos
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Revisar contratos manualmente toma horas. Con nuestra tecnología de comparación automática, identifica cada cláusula modificada, eliminada o añadida al instante.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools/compare-pdf" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Comparar contrato ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24 bg-accent/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-8">Precisión Legal garantizada</h2>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                           <Scale className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-1">Evita Errores Humanos</h3>
                           <p className="text-secondary">No dependas de la revisión visual. Nuestra IA no pasa por alto ni una coma modificada.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                           <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-1">Ideal para Convenios y Acuerdos</h3>
                           <p className="text-secondary">Perfecto para contrastar versiones de borradores antes de la firma final.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                           <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-1">Privacidad Total</h3>
                           <p className="text-secondary">Cumplimos con los más altos estándares de confidencialidad para documentos sensibles.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-border">
                     <Image 
                        src="/images/legal-compare.png" 
                        alt="Digital Lawyer" 
                        width={600} 
                        height={400}
                        className="w-full object-cover"
                     />
                  </div>
                  <div className="absolute -bottom-8 -left-8 glass p-6 rounded-2xl border border-primary/20 max-w-[200px]">
                     <div className="text-primary font-bold text-3xl mb-1">99.9%</div>
                     <div className="text-xs font-semibold text-secondary uppercase tracking-tighter">Precisión en detección de caracteres</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-8 italic">"La herramienta indispensable para el abogado moderno"</h2>
            <Link href="/tools/compare-pdf" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-bold text-xl hover:scale-105 transition-all inline-flex items-center gap-3 shadow-lg shadow-primary/20">
              Prueba el comparador legal gratis
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
        
        {/* SEO Content */}
        <section className="py-16 border-t border-border/10 bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 prose prose-invert">
                <h2 className="text-primary">Comparar Contratos PDF Automáticamente</h2>
                <p>En el ámbito legal, un pequeño cambio en una cláusula puede tener grandes consecuencias. Xylo PDF ofrece una solución especializada para <strong>comparar contratos</strong> de forma exhaustiva.</p>
                <p>Nuestra herramienta es utilizada por despachos de abogados y departamentos jurídicos para agilizar la revisión de convenios, acuerdos de confidencialidad (NDA) y contratos de servicios.</p>
                <h3>Ventajas de usar Xylo PDF para documentos legales:</h3>
                <ul>
                    <li>Resaltado visual de cambios en rojo (eliminado) y verde (añadido).</li>
                    <li>Soporte para documentos extensos (más de 100 páginas).</li>
                    <li>Exportación de informe de diferencias.</li>
                    <li>Entorno seguro y encriptado.</li>
                </ul>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
