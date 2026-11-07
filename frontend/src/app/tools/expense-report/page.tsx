"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExpenseReportUploader from "@/components/ExpenseReportUploader";
import { CheckCircle2, ChevronRight, Table2 } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ExpenseReportPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-secondary mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.navbar.home || "Inicio"}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tools" className="hover:text-primary transition-colors">{t.navbar.tools || "Herramientas"}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Convertidor XML a Excel (CFDI)</span>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-2xl mb-6 border border-green-500/20">
              <Table2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Convertir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">XML a Excel</span> Masivo
            </h1>
            <p className="text-xl text-secondary">
              La herramienta profesional para contadores. Sube tus facturas <strong>XML (CFDI 3.3 y 4.0)</strong> y genera automáticamente un reporte Excel detallado con <strong>Impuestos Trasladados, Retenciones, RFCs y Cuentas de Terceros</strong>.
            </p>
          </div>

          <ExpenseReportUploader />

          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">¿Qué campos intentamos extraer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Subtotal (Monto base antes de impuestos)",
                "IVA Trasladado (16%)",
                "IEPS (Impuesto Especial sobre Producción y Servicios)",
                "IVA Retenido (Retenciones de IVA)",
                "ISR Retenido (Retenciones de ISR)",
                "RFC Emisor y Receptor",
                "RFC Cuenta de Terceros (Complementos)",
                "Folio Fiscal (UUID)",
                "Método y Forma de Pago"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 glass rounded-xl border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
