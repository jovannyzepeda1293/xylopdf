"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Table2, FileCode, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ConvertirXmlCfdiExcel() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Informative Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-white to-slate-50">
           <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                 <Sparkles className="w-3 h-3" />
                 <span>Guía Rápida & Herramienta</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                 Cómo convertir <span className="text-primary italic">XML del SAT</span> a Excel (rápido y fácil)
              </h1>
              <p className="text-xl text-secondary mb-12">
                 ¿Recibiste cientos de archivos XML y no sabes cómo leerlos? Aquí te enseñamos a transformarlos en una tabla de Excel estructurada en menos de 10 segundos.
              </p>
              <Link href="/tools/expense-report" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-3">
                 Empezar Conversión Ahora
                 <ArrowRight className="w-6 h-6" />
              </Link>
           </div>
        </section>

        {/* Steps Guide */}
        <section className="py-20">
           <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Pasos para convertir tus CFDI</h2>
              <div className="space-y-6">
                 {[
                    { step: 1, title: "Reúne tus archivos XML", desc: "Descarga tus facturas del portal del SAT o de tu sistema de facturación. Puedes procesar un archivo o cientos a la vez." },
                    { step: 2, title: "Sube a Xylo PDF", desc: "Usa nuestro arrastrar y soltar. No necesitas instalar nada; todo funciona en tu navegador Firefox, Chrome o Safari." },
                    { step: 3, title: "Descarga tu Excel", desc: "Nuestro motor extrae los datos automáticamente. En segundos, tendrás un botón de descarga para tu archivo .xlsx estructurado." }
                 ].map((s, i) => (
                    <div key={i} className="flex gap-6 p-8 bg-white border border-border rounded-3xl items-start group hover:border-primary transition-colors">
                       <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                          {s.step}
                       </div>
                       <div>
                          <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                          <p className="text-secondary">{s.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Informative Content for SEO */}
        <section className="py-20 bg-accent/5">
            <div className="max-w-4xl mx-auto px-6 prose prose-slate">
                <h2 className="text-center mb-12">¿Por qué es difícil leer un XML del SAT?</h2>
                <p>El formato XML (eXtensible Markup Language) está diseñado para ser leído por máquinas, no por humanos. Un <strong>CFDI 4.0</strong> contiene etiquetas complejas que guardan información sobre el emisor, receptor, conceptos de venta e impuestos detallados.</p>
                <p>Intentar <strong>leer XML del SAT</strong> abriéndolos uno por uno es una pesadilla administrativa. Por eso, un <strong>visor XML CFDI</strong> como el de Xylo PDF es esencial para cualquier negocio en México.</p>
                <h3>Palabras clave para contadores:</h3>
                <ul>
                    <li><strong>Convertir XML a Excel:</strong> Transforma datos crudos en información útil.</li>
                    <li><strong>Visor XML CFDI:</strong> Previsualiza tus facturas sin software pesado.</li>
                    <li><strong>Reporte de Gastos:</strong> Genera acumulados mensuales automáticamente.</li>
                </ul>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
           <div className="max-w-5xl mx-auto px-6">
              <div className="p-16 rounded-[4rem] bg-slate-900 text-white text-center shadow-3xl">
                 <h2 className="text-4xl md:text-6xl font-black mb-8">¡Ahorra tiempo hoy mismo!</h2>
                 <Link href="/tools/expense-report" className="bg-primary text-secondary-foreground px-12 py-6 rounded-3xl font-black text-2xl hover:scale-110 transition-transform shadow-2xl inline-flex items-center gap-4">
                    Ir al Convertidor
                    <ArrowRight className="w-8 h-8" />
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
