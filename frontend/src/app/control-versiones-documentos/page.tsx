"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, History, Settings, FileText, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ControlVersiones() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-white text-slate-900">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-8">
                <Briefcase className="w-4 h-4" />
                <span>Solución Corporativa</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                Controla versiones de documentos <span className="text-primary italic">sin errores</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Evita confusiones entre borradores. Nuestra herramienta de comparación automática permite a las empresas mantener un control estricto sobre políticas, reportes y manuales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tools/compare-pdf" className="px-8 py-4 bg-primary text-secondary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Optimiza tu flujo de trabajo
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
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-100">
                <Image 
                    src="/images/office-compare.png" 
                    alt="Control de versiones en oficina" 
                    width={800} 
                    height={600}
                    className="w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Elimina el caos de las versiones en tu oficina</h2>
              <p className="text-slate-500 text-lg">La comparación automática es el estándar en las empresas modernas.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                     <History className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Historial Claro</h3>
                  <p className="text-slate-500">¿Qué cambió entre el reporte de ayer y el de hoy? Encuéntralo en un clic.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                     <Settings className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Políticas Internas</h3>
                  <p className="text-slate-500">Asegúrate de que solo se apliquen los cambios aprobados en las nuevas reglas de la empresa.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                     <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Manuales de Usuario</h3>
                  <p className="text-slate-500">Detecta diferencias entre versiones de manuales técnicos para evitar errores de soporte.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
             <h2 className="text-4xl font-bold mb-6">Centraliza tu control documental</h2>
             <p className="text-xl text-slate-600 mb-10">Más de 500 empresas ya confían en Xylo PDF para su gestión de archivos.</p>
             <Link href="/tools/compare-pdf" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-bold text-xl hover:shadow-2xl transition-all inline-flex items-center gap-3">
              Empezar ahora
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
        
        {/* SEO Content */}
        <section className="py-16 border-t border-border/10">
            <div className="max-w-4xl mx-auto px-6 prose prose-slate">
                <h2>Control de Versiones de Documentos PDF para Empresas</h2>
                <p>En el entorno corporativo, la gestión eficiente de documentos es vital. El <strong>control de versiones</strong> a menudo se vuelve caótico cuando varios miembros del equipo editan el mismo archivo PDF.</p>
                <p>Xylo PDF ofrece un <strong>comparador de documentos</strong> robusto que permite auditar cambios en fracciones de segundo. Desde reportes financieros hasta políticas de RRHH, nuestra herramienta asegura que nada pase desapercibido.</p>
                <h3>Casos de uso frecuentes en oficinas:</h3>
                <ul>
                    <li>Revisiones de reportes anuales y estados financieros.</li>
                    <li>Actualización de manuales de procedimientos internos.</li>
                    <li>Verificación de cláusulas en propuestas comerciales.</li>
                    <li>Auditoría de cambios entre borradores y documentos finales.</li>
                </ul>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
