"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Image as ImageIcon, X, CheckCircle2, Loader2,
  AlertCircle, Download, Files, Trash2, File as FileIcon
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import LimitModal from "@/components/LimitModal";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ImageToPdfUploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { 
    checkLimit, 
    incrementUsage, 
    showLimitModal, 
    setShowLimitModal, 
    usageInfo, 
    isLoggedIn 
  } = useUsageLimit();

  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".bmp"];

      const invalidFiles = selectedFiles.filter(file => {
        const fileName = file.name.toLowerCase();
        return !validExtensions.some(ext => fileName.endsWith(ext));
      });

      if (invalidFiles.length > 0) {
        setErrorMessage(t.uploader.errorOnlyImages);
        setStatus("error");
        return;
      }

      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setFiles(prev => [...prev, ...selectedFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
      setErrorMessage("");
      if (status === "error") setStatus("idle");
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const startConversion = async () => {
    if (files.length === 0) return;

    // Check usage limit
    const isAllowed = await checkLimit();
    if (!isAllowed) return;

    setStatus("uploading");
    setErrorMessage("");
    setProgress(0);

    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 5));
      }, 500);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/image-to-pdf`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.uploader.errorFetching);
      }

      // Increment usage
      await incrementUsage();

      setProgress(100);
      setStatus("processing");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      setTimeout(() => {
        setStatus("completed");
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || t.uploader.errorUnexpected);
      setStatus("error");
    }
  };

  const reset = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setStatus("idle");
    setFiles([]);
    setPreviews([]);
    setProgress(0);
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">

        {/* Progress Bar */}
        {(status === "uploading" || status === "processing") && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-1.5 bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)] z-20"
          />
        )}

        <AnimatePresence mode="wait">
          {(status === "idle" || status === "error") && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
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
                  className="border-2 border-dashed border-border rounded-3xl p-8 hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col items-center justify-center text-center bg-accent/30"
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.bmp"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer w-full h-full">
                    <div className="flex flex-col items-center gap-4 py-10">
                      <div className="p-4 bg-teal-500/10 rounded-full group-hover:bg-teal-500/20 group-hover:text-teal-500 transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                      <span className="font-semibold">{t.uploader.dropzoneImages}</span>
                      <span className="text-xs text-secondary/60">{t.uploader.formatSupportImages}</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col h-full min-h-[250px] justify-between text-left">
                  <div>
                    <h3 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider">{t.uploader.selectedImages} ({files.length})</h3>
                    {files.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-teal-500/30">
                        <AnimatePresence mode="popLayout">
                          {files.map((file, index) => (
                            <motion.div
                              key={previews[index]}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative aspect-video rounded-xl overflow-hidden border border-border group/item"
                            >
                              <img
                                src={previews[index]}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-[10px] text-white font-bold truncate">{file.name}</p>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="h-[100px] flex flex-col items-center justify-center text-secondary/40 border border-border/50 rounded-2xl border-dashed">
                        <Files className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-xs">{t.uploader.noImages}</p>
                      </div>
                    )}
                  </div>

                  {files.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={startConversion}
                      className="mt-6 w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                    >
                      {t.imageToPdf.uploader.title} ({files.length})
                      <FileIcon className="w-5 h-5" />
                    </motion.button>
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
                <Loader2 className="w-20 h-20 text-teal-500 animate-spin" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {status === "uploading" ? t.imageToPdf.uploader.loading1 : t.imageToPdf.uploader.loading2}
              </h2>
              <p className="text-secondary max-w-sm mx-auto">
                {t.imageToPdf.uploader.loadingDesc}
              </p>
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
                <div className="w-28 h-28 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/30">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">{t.imageToPdf.uploader.success}</h2>
              <p className="text-secondary mb-12">{t.imageToPdf.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download="imagenes_unidas.pdf"
                  className="px-12 py-5 bg-teal-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3"
                >
                  {t.imageToPdf.uploader.btnDownload}
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={reset}
                  className="px-12 py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border"
                >
                  {t.uploader.btnReset}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Limit Modal */}
        <LimitModal 
          show={showLimitModal} 
          onClose={() => setShowLimitModal(false)}
          resetTime={usageInfo?.resetTime || 0}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
