"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Clock, Ban, BarChart3, Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AutomatizarFacturas() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Pain points section */}
        <section className="relative pt-32 pb-20 bg-slate-950 text-white overflow-hidden">
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm mb-8">
                   <Clock className="w-4 h-4" />
                   <span>Deja de perder tiempo</span>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                   Automatiza la lectura de <span className="text-green-500">facturas</span> del SAT
                 </h1>
                 <div className="space-y-6 mb-12">
                    <div className="flex gap-4 items-start">
                       <Ban className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                       <p className="text-lg text-slate-400">Adiós a la <strong>captura manual</strong> tediosa y propensa a errores.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                       <Ban className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                       <p className="text-lg text-slate-400">Elimina el <strong>tiempo perdido</strong> procesando facturas una por una.</p>
                    </div>
                 </div>
                 <Link href="/tools/expense-report" className="px-10 py-5 bg-green-600 text-white rounded-2xl font-black text-xl hover:bg-green-500 transition-all inline-flex items-center gap-3">
                    Empezar Automatización
                    <ArrowRight className="w-6 h-6" />
                 </Link>
              </motion.div>
              
              <div className="relative">
                 <div className="glass p-1 rounded-[2.5rem] border border-white/10 overflow-hidden">
                    <Image 
                       src="/images/xml-excel.png" 
                       alt="Automated invoicing" 
                       width={600} 
                       height={450}
                       className="w-full object-cover rounded-[2.2rem]"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Benefits for productivity */}
        <section className="py-24">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                 <h2 className="text-4xl font-bold mb-4">¿Por qué automatizar con Xylo PDF?</h2>
                 <p className="text-xl text-secondary">Diseñado para maximizar la productividad de tu negocio.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="order-2 md:order-1">
                    <Image 
                       src="/images/accountant-happy.png" 
                       alt="Productive environment" 
                       width={500} 
                       height={400}
                       className="rounded-3xl shadow-2xl"
                    />
                 </div>
                 <div className="space-y-8 order-1 md:order-2">
                    <div className="flex gap-6">
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                          <Rocket className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold mb-2">Velocidad Increíble</h3>
                          <p className="text-secondary">Procesa colecciones completas de XML en segundos y descarga tu Excel listo para conciliación.</p>
                       </div>
                    </div>
                    <div className="flex gap-6">
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                          <BarChart3 className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold mb-2">Visualización Clara</h3>
                          <p className="text-secondary">Generamos un reporte estructurado que facilita el análisis de gastos e ingresos mensuales.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CTA section */}
        <section className="py-24 bg-accent/5 border-y border-border/10">
           <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-black mb-10">La productividad no es trabajar más horas, es usar mejores herramientas.</h2>
              <Link href="/tools/expense-report" className="px-12 py-6 bg-primary text-secondary-foreground rounded-3xl font-black text-2xl hover:scale-110 transition-transform flex items-center justify-center gap-4 mx-auto w-fit">
                 Automatizar mis facturas ahora
                 <ArrowRight className="w-8 h-8" />
              </Link>
           </div>
        </section>
        
        {/* SEO Technical Footer */}
        <section className="py-16">
            <div className="max-w-4xl mx-auto px-6 prose prose-slate">
                <h2>Procesamiento automático de facturas CFDI</h2>
                <p>La <strong>automatización de facturas</strong> es el siguiente paso lógico para cualquier empresa que maneje un volumen considerable de transacciones. El formato CFDI del SAT contiene una riqueza de datos que, de ser capturados a mano, consumirían días de trabajo.</p>
                <p>Nuestra solución utiliza algoritmos de parsing de alto rendimiento para leer cada nodo del archivo XML, incluyendo los <strong>impuestos locales y federales</strong>, garantizando que la información que llega a tu Excel sea fiel a la realidad fiscal del comprobante.</p>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
