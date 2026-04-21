"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Table2, FileCode, CheckCircle, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LeerXmlCfdi() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-background">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-green-500/10 blur-[120px] -z-10 rounded-full" />
          
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 font-bold text-sm mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Compatible con CFDI 4.0</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                Convierte <span className="text-green-600">XML</span> del SAT a <span className="text-primary">Excel</span> en segundos 🚀
              </h1>
              <p className="text-xl text-secondary mb-10 leading-relaxed">
                Olvida la captura manual. Nuestra herramienta extrae automáticamente impuestos, RFCs y montos de tus facturas XML para generar reportes profesionales en un clic.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tools/expense-report" className="px-10 py-5 bg-green-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-green-600/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Subir XML ahora
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-secondary font-medium">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Sin errores</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Sin capturar a mano</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                 <Image 
                    src="/images/xml-excel.png" 
                    alt="XML to Excel transformation" 
                    width={700} 
                    height={500}
                    className="w-full object-cover"
                 />
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-green-500/20 blur-[100px] -z-10 rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-24 border-t border-border/50 bg-accent/5">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid md:grid-cols-3 gap-12 text-center">
                <div className="p-8">
                   <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                      <Zap className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">Ahorra horas</h3>
                   <p className="text-secondary">Procesa cientos de facturas en lo que tardas en abrir una sola en el visor del SAT.</p>
                </div>
                <div className="p-8">
                   <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                      <Shield className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">Evita errores</h3>
                   <p className="text-secondary">La extracción automática garantiza que cada centavo de IVA, IEPS e ISR esté en su lugar.</p>
                </div>
                <div className="p-8">
                   <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500">
                      <FileCode className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">CFDI 4.0 Ready</h3>
                   <p className="text-secondary">Totalmente compatible con la última versión de facturación del SAT y complementos.</p>
                </div>
             </div>
          </div>
        </section>
        
        {/* Detailed Content for SEO */}
        <section className="py-20">
            <div className="max-w-4xl mx-auto px-6 prose prose-lg prose-green">
                <h2 className="text-4xl font-bold mb-8">El mejor visor de XML a Excel para México</h2>
                <p>Nuestra plataforma está diseñada específicamente para el ecosistema fiscal mexicano. No solo convertimos texto, entendemos la estructura de un <strong>CFDI 4.0</strong>.</p>
                <p>Extraemos información crítica que otras herramientas ignoran:</p>
                <ul>
                    <li><strong>Impuestos Detallados:</strong> IVA (0%, 8%, 16%), IEPS y Retenciones.</li>
                    <li><strong>Datos Fiscales:</strong> RFC del emisor, receptor y UUID (folio fiscal).</li>
                    <li><strong>Complementos:</strong> Pagos, nómina y cuentas de terceros.</li>
                </ul>
                <p>Usa Xylo PDF para transformar tus <strong>XML del SAT a Excel</strong> y toma el control de tu contabilidad hoy mismo.</p>
            </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 bg-green-600">
           <div className="max-w-5xl mx-auto px-6 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-black mb-8">¿Listo para dejar de capturar facturas?</h2>
              <Link href="/tools/expense-report" className="px-12 py-6 bg-white text-green-600 rounded-3xl font-black text-2xl hover:scale-110 transition-transform shadow-2xl inline-flex items-center gap-4">
                 Convertir mis XML ahora
                 <ArrowRight className="w-8 h-8" />
              </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
