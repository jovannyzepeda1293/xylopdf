"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Users, Briefcase, Download, LayoutGrid, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HerramientasContadores() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Professional Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
             >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-8">
                   <Briefcase className="w-4 h-4" />
                   <span>Para Despachos y Freelancers</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                  Herramientas digitales para <span className="text-primary">contadores modernos</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                   Sabemos que manejas múltiples clientes. Xylo PDF te ayuda a organizar y procesar miles de XML al mes sin esfuerzo, permitiéndote ofrecer un servicio más rápido y profesional.
                </p>
                <Link href="/tools/expense-report" className="px-10 py-5 bg-primary text-secondary-foreground rounded-2xl font-black text-xl hover:shadow-2xl transition-all inline-flex items-center gap-3">
                   Optimizar mi Despacho
                   <ArrowRight className="w-6 h-6" />
                </Link>
             </motion.div>
             
             <div className="relative">
                <Image 
                   src="/images/accountant-happy.png" 
                   alt="Modern accountant" 
                   width={600} 
                   height={480}
                   className="rounded-[3rem] shadow-3xl"
                />
                <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl border border-primary/20 shadow-2xl max-w-[280px]">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-widest text-secondary">Exportando masivamente</span>
                   </div>
                   <div className="space-y-3">
                      <div className="h-2 w-full bg-primary/10 rounded" />
                      <div className="h-2 w-3/4 bg-primary/10 rounded" />
                      <div className="h-2 w-1/2 bg-primary/10 rounded" />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Features for accountants */}
        <section className="py-24">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-bold mb-4">Diseñado específicamente para el contador</h2>
                 <p className="text-xl text-secondary">Funciones avanzadas que simplifican tu vida profesional.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                 {[
                    { 
                      icon: <LayoutGrid className="w-8 h-8" />, 
                      title: "Multi XML Masivo", 
                      desc: "Sube carpetas completas de XML de diferentes clientes y procésalos en un solo paso." 
                    },
                    { 
                      icon: <Download className="w-8 h-8" />, 
                      title: "Exportación a Excel", 
                      desc: "Reportes estructurados listos para importar a sistemas como COI, ASPEL o CONTPAQi." 
                    },
                    { 
                      icon: <Users className="w-8 h-8" />, 
                      title: "Organización por Cliente", 
                      desc: "Mantén tus auditorías al día detectando inconsistencias fiscales automáticamente." 
                    }
                 ].map((feat, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-accent/5 border border-border hover:bg-white hover:shadow-xl transition-all hover:scale-105 border-b-4 border-b-primary/30">
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                          {feat.icon}
                       </div>
                       <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                       <p className="text-secondary leading-relaxed">{feat.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Closing section */}
        <section className="py-24 bg-slate-900 text-white text-center">
           <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Lleva tu despacho al nivel Pro</h2>
              <p className="text-xl text-slate-400 mb-12">No te quedes atrás en la transformación digital. Ofrece a tus clientes reportes precisos y al instante.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <Link href="/unlimited-access" className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:scale-105 transition-transform">
                    Ver planes para despachos
                 </Link>
                 <Link href="/tools/expense-report" className="px-10 py-5 bg-transparent border border-white/20 rounded-2xl font-bold text-xl hover:bg-white/5 transition-colors">
                    Prueba Gratis Directa
                 </Link>
              </div>
           </div>
        </section>
        
        {/* SEO content */}
        <section className="py-16">
            <div className="max-w-4xl mx-auto px-6 prose prose-blue">
                <h2>Software para Contadores: Conversión de XML del SAT</h2>
                <p>En el despacho contable moderno, la eficiencia es la clave de la rentabilidad. Nuestra herramienta de <strong>lectura de XML masiva</strong> está optimizada para manejar altos volúmenes de comprobantes fiscales digitales.</p>
                <p>Al convertir tus archivos XML a Excel, facilitas procesos críticos como:</p>
                <ul>
                    <li>Conciliación bancaria contra facturación.</li>
                    <li>Determinación mensual de IVA acreditable y retenido.</li>
                    <li>Cálculo de nómina y asimilados a salarios mediante lectura de complementos.</li>
                    <li>Auditoría interna de UUIDs duplicados o RFCs en listas negras.</li>
                </ul>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
