"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle2, Loader2, AlertCircle, FilePlus, Trash2, Image as ImageIcon, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Star } from "lucide-react";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import LimitModal from "@/components/LimitModal";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useSession } from "next-auth/react";

interface SelectedFile {
  file: File;
}

export default function ExpenseReportUploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const { 
    checkLimit, 
    incrementUsage, 
    showLimitModal, 
    setShowLimitModal, 
    usageInfo, 
    isLoggedIn 
  } = useUsageLimit();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validTypes = ["text/xml", "application/xml"];
      
      const invalidFiles = newFiles.filter(f => !validTypes.includes(f.type) && !f.name.endsWith('.xml'));
      if (invalidFiles.length > 0) {
        setErrorMessage("Por favor, sube solo archivos XML (CFDI).");
        setStatus("error");
        return;
      }

      setFiles(prev => [...prev, ...newFiles.map(f => ({ file: f }))]);
      setErrorMessage("");
      if (status === "error") setStatus("idle");
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startExtraction = async () => {
    if (files.length === 0) {
      setErrorMessage("Debes subir al menos un archivo.");
      setStatus("error");
      return;
    }

    // Check usage limit 5 files a day logic is handled inside usage hook limits.
    // If we want exactly 5 files of allowance we can use checkLimit() per file, but normally one execution = 1 limit deduction.
    // Assuming backend takes all files, we use one checkLimit for the batch.
    const isAllowed = await checkLimit(files.length, 5);
    if (!isAllowed) return;

    setStatus("uploading");
    setErrorMessage("");
    setProgress(0);

    const formData = new FormData();
    files.forEach(f => {
      formData.append("files", f.file);
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 300);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/expense-report`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Error procesando los archivos.");
      }

      await incrementUsage(files.length);

      setProgress(100);
      setStatus("processing");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      setTimeout(() => {
        setStatus("completed");
      }, 1000);

    } catch (err: any) {
      setErrorMessage(err.message || "Error inesperado");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setFiles([]);
    setProgress(0);
    setErrorMessage("");
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">
        
        {(status === "uploading" || status === "processing") && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-1.5 bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20"
          />
        )}

        <AnimatePresence mode="wait">
          {(status === "idle" || status === "error") && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMessage}
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div 
                  className="border-2 border-dashed border-border rounded-3xl p-8 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center"
                >
                  <input 
                    type="file" 
                    multiple
                    accept=".xml"
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer w-full h-full">
                    <div className="flex flex-col items-center gap-4 py-10">
                      <div className="p-4 bg-accent rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <FilePlus className="w-8 h-8" />
                      </div>
                      <span className="font-semibold">Subir Facturas XML</span>
                      <span className="text-xs text-secondary/60">Selecciona o arrastra los CFDI aquí</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col h-full min-h-[250px] max-h-[400px]">
                  <h3 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider">{t.uploader.selectedFiles} ({files.length})</h3>
                  <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {files.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-secondary/40 border border-border/50 rounded-2xl border-dashed">
                        <File className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-xs">{t.uploader.noFiles}</p>
                      </div>
                    ) : (
                      files.map((fileObj, index) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={`${fileObj.file.name}-${index}`}
                          className="p-3 glass border border-border/50 rounded-xl flex items-center justify-between group/item"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                               {fileObj.file.name.endsWith('.xml') ? <FileText className="w-5 h-5 text-purple-500" /> : 
                                <File className="w-5 h-5 text-red-500" />}
                            </div>
                            <div className="flex flex-col overflow-hidden text-left">
                              <span className="text-sm font-bold truncate max-w-[150px]">{fileObj.file.name}</span>
                              <span className="text-[10px] text-secondary">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(index)}
                            className="p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {files.length >= 1 && (
                    <div className="space-y-3 mt-6">
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={startExtraction}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group"
                      >
                        Generar Reporte Contable (.xlsx)
                        <CheckCircle2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>

                      {!session?.user?.subscriptionActive && (
                        <Link
                          href="/unlimited-access"
                          className="w-full py-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl font-bold hover:bg-amber-500/20 flex items-center justify-center gap-2 text-sm"
                        >
                          <Star className="w-4 h-4 fill-amber-500" />
                          Acceso ilimitado a extracción
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {(status === "uploading" || status === "processing") && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="mb-8 flex justify-center">
                <Loader2 className="w-20 h-20 text-primary animate-spin" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Procesando y Extrayendo Datos</h2>
              <p className="text-secondary animate-pulse">Generando tu archivo Excel inteligente...</p>
            </motion.div>
          )}

          {status === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="mb-8 flex justify-center">
                <CheckCircle2 className="w-24 h-24 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">¡Reporte Generado!</h2>
                            <p className="text-secondary mb-10">Tus facturas han sido tabuladas con detalles de impuestos (IVA, IEPS, Retenciones) en Excel.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={downloadUrl || "#"} 
                  download="reporte_gastos.xlsx"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90"
                >
                  Descargar Reporte (.xlsx)
                </a>
                <button 
                  onClick={reset}
                  className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-bold hover:opacity-80"
                >
                  Procesar Nuevos Archivos
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <LimitModal 
          show={showLimitModal} 
          onClose={() => setShowLimitModal(false)}
          resetTime={usageInfo?.resetTime || 0}
          isLoggedIn={isLoggedIn}
          isExpired={usageInfo?.isExpired}
        />
      </div>
    </div>
  );
}
