"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparePdfUploader from "@/components/ComparePdfUploader";
import { Coffee, Gift, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CompararPdfGratis() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 text-pink-600 font-bold text-xs uppercase tracking-widest mb-6">
              <Gift className="w-3 h-3" />
              <span>Herramienta 100% Gratuita</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Comparador de PDF <span className="text-primary italic">Gratis</span> Online
            </h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Sin registros, sin tarjetas de crédito, sin esperas. La herramienta más simple para comparar tus archivos PDF al instante.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto mb-20">
            <ComparePdfUploader />
          </div>

          {/* Simple Benefits */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             <div className="p-6 rounded-2xl bg-accent/5 border border-border">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-bold mb-2">Muy Simple</h3>
                <p className="text-sm text-secondary">Sube, compara y listo. Diseñado para la máxima velocidad.</p>
             </div>
             <div className="p-6 rounded-2xl bg-accent/5 border border-border">
                <div className="text-2xl mb-2">🔓</div>
                <h3 className="font-bold mb-2">Sin Registro</h3>
                <p className="text-sm text-secondary">Tu privacidad es lo primero. No te pediremos ningún dato.</p>
             </div>
             <div className="p-6 rounded-2xl bg-accent/5 border border-border">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-bold mb-2">Sin Fricción</h3>
                <p className="text-sm text-secondary">Sin anuncios molestos ni pasos intermedios innecesarios.</p>
             </div>
          </div>
        </div>

        {/* SEO & Growth Hack Section */}
        <section className="mt-32 border-t border-border/10 pt-20 bg-accent/5">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                    <div className="flex-1">
                        <h2 className="text-3xl font-extrabold mb-6">¿Buscas comparar PDF sin pagar?</h2>
                        <div className="prose prose-sm text-secondary">
                            <p>Sabemos lo frustrante que es encontrar una herramienta gratuita que luego te pide pagar para ver los resultados. En Xylo PDF ofrecemos un <strong>comparador de PDF online gratis</strong> que funciona de verdad.</p>
                            <p>Esta herramienta es parte de nuestra misión de democratizar el manejo de archivos PDF mediante el uso de inteligencia artificial. Queremos que ahorres tiempo y dinero en tus tareas diarias.</p>
                            <p>Recuerda que para un uso intensivo o archivos extremadamente grandes, contamos con planes <span className="text-primary font-bold">Premium</span>, pero nuestra herramienta básica siempre será gratuita para la comunidad.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-80 glass p-8 rounded-3xl border border-primary/20 text-center">
                        <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h4 className="font-bold mb-2">¿Te gusta la herramienta?</h4>
                        <p className="text-xs text-secondary mb-4">Compártela con tus amigos o déjanos un comentario. ¡Nos ayuda mucho!</p>
                        <button className="w-full py-2 bg-primary text-secondary-foreground rounded-xl font-bold text-sm">
                            Compartir en Twitter
                        </button>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
