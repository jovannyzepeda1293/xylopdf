"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExpenseReportUploader from "@/components/ExpenseReportUploader";
import { Coffee, Gift, Heart, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function XmlAExcelGratis() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-100 text-green-600 font-bold text-xs uppercase tracking-widest mb-6">
              <Gift className="w-3 h-3" />
              <span>Herramienta 100% Gratuita</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">
              Convierte <span className="text-green-600">XML a Excel</span> gratis
            </h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg mb-8">
              Sin registros, sin correos, sin esperas. Sube tus archivos XML del SAT y recibe tu reporte Excel al instante.
            </p>
            
            <div className="flex justify-center gap-4 mb-16 text-sm font-semibold text-secondary">
               <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Sin registro</div>
               <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Rápido</div>
               <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Seguro</div>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 blur-2xl rounded-[3rem] -z-10" />
            <ExpenseReportUploader />
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto text-left mt-32">
             <div>
                <h3 className="text-2xl font-bold mb-4">¿Por qué es gratis?</h3>
                <p className="text-secondary leading-relaxed">
                   Queremos que experimentes la potencia de Xylo PDF. Esta herramienta gratuita es una muestra de nuestro motor de procesamiento premium, limitado a unos pocos archivos por sesión para que todos puedan usarlo sin costo.
                </p>
             </div>
             <div>
                <h3 className="text-2xl font-bold mb-4">¿Es seguro subir mis XML?</h3>
                <p className="text-secondary leading-relaxed">
                   Absolutamente. Tus archivos se procesan en memoria y se eliminan de forma inmediata. No almacenamos datos fiscales ni compartimos tu información con nadie.
                </p>
             </div>
          </div>
        </div>

        {/* Growth section */}
        <section className="mt-32 border-t border-border/10 pt-20 bg-accent/5">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-extrabold mb-6">¿Necesitas procesar miles de facturas?</h2>
                <p className="text-secondary mb-10">Si eres un despacho contable con gran volumen, tenemos planes diseñados para ti con procesamiento ilimitado y funciones avanzadas.</p>
                <div className="flex justify-center gap-6">
                    <Link href="/unlimited-access" className="px-8 py-4 bg-primary text-secondary-foreground rounded-xl font-bold">Ver Planes Premium</Link>
                    <button className="px-8 py-4 bg-white border border-border rounded-xl font-bold flex items-center gap-2">
                       <Coffee className="w-4 h-4 text-orange-500" /> Invítanos un café
                    </button>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
