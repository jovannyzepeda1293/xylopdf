"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle2, Loader2, AlertCircle, FilePlus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { generateThumbnail } from "@/lib/pdf-preview";
import Link from "next/link";
import { Star } from "lucide-react";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import LimitModal from "@/components/LimitModal";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useSession } from "next-auth/react";

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function Uploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validation: Only PDFs
      const invalidFiles = newFiles.filter(f => f.type !== "application/pdf");
      if (invalidFiles.length > 0) {
        setErrorMessage(t.uploader.errorOnlyPdf);
        setStatus("error");
        return;
      }

      const filesWithPreviews: FileWithPreview[] = [];
      for (const file of newFiles) {
        const preview = await generateThumbnail(file);
        filesWithPreviews.push({ file, preview });
      }

      setFiles(prev => [...prev, ...filesWithPreviews]);
      setErrorMessage("");
      if (status === "error") setStatus("idle");
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startMerge = async () => {
    if (files.length < 2) {
      setErrorMessage(t.uploader.errorMinFiles);
      setStatus("error");
      return;
    }

    // Check usage limit
    const isAllowed = await checkLimit();
    if (!isAllowed) return;

    setStatus("uploading");
    setErrorMessage("");
    setProgress(0);

    const formData = new FormData();
    files.forEach(f => {
      formData.append("files", f.file);
    });

    try {
      // Simulate progress for UI feel
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/merge`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.uploader.errorFetching || "Error");
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
        
        {/* Progress Bar */}
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
              {/* Error Message */}
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

              {/* Drop Zone */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div 
                  className="border-2 border-dashed border-border rounded-3xl p-8 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center"
                >
                  <input 
                    type="file" 
                    multiple
                    accept=".pdf"
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer w-full h-full">
                    <div className="flex flex-col items-center gap-4 py-10">
                      <div className="p-4 bg-accent rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <FilePlus className="w-8 h-8" />
                      </div>
                      <span className="font-semibold">{t.uploader.dropzoneMultiple}</span>
                      <span className="text-xs text-secondary/60">{t.uploader.minFiles}</span>
                    </div>
                  </label>
                </div>

                {/* File List */}
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
                            <div className="w-12 h-16 bg-blue-500/10 rounded-lg overflow-hidden border border-border flex-shrink-0 relative">
                              {fileObj.preview ? (
                                <img src={fileObj.preview} alt="PDF Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <File className="w-4 h-4 text-blue-500" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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

                  {files.length >= 2 && (
                    <div className="space-y-3 mt-6">
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={startMerge}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                      >
                        {t.uploader.btnMerge}
                        <CheckCircle2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>

                      {!session?.user?.subscriptionActive && (
                        <Link
                          href="/unlimited-access"
                          className="w-full py-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl font-bold hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 group text-sm"
                        >
                          <Star className="w-4 h-4 fill-amber-500" />
                          {t.navbar.unlimitedAccess}
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
                <div className="relative">
                  <Loader2 className="w-20 h-20 text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{progress}%</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {status === "uploading" ? t.uploader.uploadingMultiple : t.uploader.processing}
              </h2>
              <p className="text-secondary animate-pulse">
                {t.uploader.processingDesc}
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
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{t.uploader.successMergeTitle}</h2>
              <p className="text-secondary mb-10">{t.uploader.successMergeDesc}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={downloadUrl || "#"} 
                  download="unido_xylopdf.pdf"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {t.uploader.btnDownloadMerge}
                </a>
                <button 
                  onClick={reset}
                  className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border"
                >
                  {t.uploader.btnResetMerge}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Premium Limit Modal */}
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
