"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, X, CheckCircle2, Loader2,
  AlertCircle, FileSpreadsheet, Download, Trash2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { generateThumbnail } from "@/lib/pdf-preview";
import { useI18n } from "@/lib/i18n/I18nContext";

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function ExcelUploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setErrorMessage(t.uploader.errorOnlyPdf);
        setStatus("error");
        return;
      }
      
      const preview = await generateThumbnail(selectedFile);
      setFile({ file: selectedFile, preview });
      setErrorMessage("");
      if (status === "error") setStatus("idle");
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const startConversion = async () => {
    if (!file) return;

    setStatus("uploading");
    setErrorMessage("");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file.file);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 300);

      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pdf-to-excel", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.uploader.errorFetching);
      }

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
    setFile(null);
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
            className="absolute top-0 left-0 h-1.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] z-20"
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
                  className="border-2 border-dashed border-border rounded-3xl p-8 hover:border-green-500/50 transition-all cursor-pointer group flex flex-col items-center justify-center text-center bg-accent/30"
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer w-full h-full">
                    <div className="flex flex-col items-center gap-4 py-10">
                      <div className="p-4 bg-green-500/10 rounded-full group-hover:bg-green-500/20 group-hover:text-green-500 transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                      <span className="font-semibold">{t.uploader.dropzone}</span>
                      <span className="text-xs text-secondary/60">{t.uploader.formatSupport}</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col h-full min-h-[250px] justify-between text-left">
                  <div>
                    <h3 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider">{t.uploader.selectedFile}</h3>
                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 glass border border-border/50 rounded-xl flex items-center justify-between group/item"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-16 bg-green-500/10 rounded-lg overflow-hidden border border-border flex-shrink-0 relative">
                            {file.preview ? (
                              <img src={file.preview} alt="PDF Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <File className="w-4 h-4 text-green-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col overflow-hidden text-left">
                            <span className="text-sm font-bold truncate max-w-[150px]">{file.file.name}</span>
                            <span className="text-[10px] text-secondary">{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                        <button
                          onClick={removeFile}
                          className="p-2 text-secondary hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <div className="h-[100px] flex flex-col items-center justify-center text-secondary/40 border border-border/50 rounded-2xl border-dashed">
                        <File className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-xs">{t.uploader.noFile}</p>
                      </div>
                    )}
                  </div>

                  {file && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={startConversion}
                      className="mt-6 w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                    >
                      {t.pdfToExcel.uploader.title}
                      <FileSpreadsheet className="w-5 h-5" />
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
                <Loader2 className="w-20 h-20 text-green-500 animate-spin" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {status === "uploading" ? t.pdfToExcel.uploader.loading1 : t.pdfToExcel.uploader.loading2}
              </h2>
              <p className="text-secondary max-w-sm mx-auto">
                {t.pdfToExcel.uploader.loadingDesc}
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
              <h2 className="text-4xl font-bold mb-4">{t.pdfToExcel.uploader.success}</h2>
              <p className="text-secondary mb-12">{t.pdfToExcel.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download={`convertido_${file?.file.name.split(".")[0]}.xlsx`}
                  className="px-12 py-5 bg-green-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-green-500/30 flex items-center justify-center gap-3"
                >
                  {t.pdfToExcel.uploader.btnDownload}
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
      </div>
    </div>
  );
}
