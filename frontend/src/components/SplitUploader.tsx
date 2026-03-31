"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { generateThumbnail } from "@/lib/pdf-preview";
import * as pdfjsLib from 'pdfjs-dist';
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, Scissors, FileText, Download, X, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

import { useI18n } from '@/lib/i18n/I18nContext';

export default function SplitUploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [cutPoints, setCutPoints] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [numFiles, setNumFiles] = useState(0);
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
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        setErrorMessage(t.splitPdf.uploader.errorOnlyPdf);
        setStatus("error");
        return;
      }

      setFile(selectedFile);
      setStatus("idle");
      setErrorMessage("");

      const thumb = await generateThumbnail(selectedFile);
      setThumbnail(thumb);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPageCount(pdf.numPages);
        pdf.destroy();
      } catch (err) {
        console.error("Error loading PDF info:", err);
      }
    }
  };

  const validateCuts = () => {
    if (!cutPoints.trim()) return { valid: true, cuts: [], error: "" };

    const parts = cutPoints.split(",").map(p => p.trim()).filter(p => p !== "");
    const cuts = parts.map(p => parseInt(p));

    if (cuts.some(isNaN)) {
      return { valid: false, cuts: [], error: t.splitPdf.uploader.errorInvalidCuts };
    }

    if (cuts.some(c => c <= 0 || c >= pageCount)) {
      return { valid: false, cuts: [], error: t.splitPdf.uploader.errorRangeCuts };
    }

    for (let i = 0; i < cuts.length - 1; i++) {
      if (cuts[i] >= cuts[i + 1]) {
        return { valid: false, cuts: [], error: t.splitPdf.uploader.errorOrderCuts };
      }
    }

    return { valid: true, cuts, error: "" };
  };

  useEffect(() => {
    const { valid, cuts } = validateCuts();
    if (valid) {
      setNumFiles(cuts.length + 1);
      if (status === "error") setStatus("idle");
    }
  }, [cutPoints, pageCount]);

  const startSplit = async () => {
    const { valid, error } = validateCuts();
    if (!valid) {
      setErrorMessage(error);
      setStatus("error");
      return;
    }

    const isAllowed = await checkLimit();
    if (!isAllowed) return;

    setStatus("uploading");
    setErrorMessage("");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file!);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : 90));
      }, 200);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/split?cut_points=${cutPoints}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.splitPdf.uploader.errorFetching);
      }

      setProgress(100);
      setStatus("processing");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      await incrementUsage();

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
    setThumbnail("");
    setPageCount(0);
    setCutPoints("");
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
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMessage}
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Upload Zone */}
                <div>
                  {!file ? (
                    <div className="border-2 border-dashed border-border rounded-3xl p-12 hover:border-primary/50 transition-colors cursor-pointer group h-full flex flex-col items-center justify-center text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="split-upload"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="split-upload" className="cursor-pointer w-full h-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-accent rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            <Scissors className="w-8 h-8" />
                          </div>
                          <span className="font-bold text-lg">{t.splitPdf.uploader.chooseFile || "Elegir PDF para dividir"}</span>
                          <span className="text-sm text-secondary">{t.splitPdf.uploader.uploadHint || "Arrastra tu archivo aquí"}</span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="glass border border-border/50 rounded-3xl p-8 text-center h-full flex flex-col items-center justify-center relative group">
                      <button
                        onClick={reset}
                        className="absolute top-4 right-4 p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title={t.splitPdf.uploader.changeFile}
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="w-32 h-44 bg-blue-500/5 rounded-xl border border-border shadow-2xl overflow-hidden mb-6 relative">
                        {thumbnail ? (
                          <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full flex items-center justify-center italic text-xs text-secondary/30">{t.uploader.loading || "Cargando..."}</div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-[10px] text-white font-bold rounded-md shadow-lg">
                          {pageCount} {t.splitPdf.uploader.pageCountShort || "PÁGS"}
                        </div>
                      </div>

                      <h3 className="font-bold text-lg mb-2 truncate max-w-full">{file.name}</h3>
                      <p className="text-secondary text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>

                {/* Right: Controls */}
                <div className="flex flex-col justify-center">
                  <div className={cn("space-y-6", !file && "opacity-20 pointer-events-none transition-opacity")}>
                    <div>
                      <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-secondary">
                        {t.splitPdf.uploader.cutPoints}
                      </label>
                      <input
                        type="text"
                        placeholder={t.splitPdf.uploader.cutPointsPlaceholder}
                        className="w-full bg-accent border border-border rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-secondary/40 font-medium"
                        value={cutPoints}
                        onChange={(e) => setCutPoints(e.target.value)}
                        disabled={!file}
                      />
                      <p className="text-[11px] text-secondary mt-3 leading-relaxed italic">
                        {t.splitPdf.uploader.cutPointsHint}
                      </p>
                    </div>

                    {file && (
                      <div className="space-y-3">
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={startSplit}
                          className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                        >
                          {t.splitPdf.uploader.title}
                          <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
                {status === "uploading" ? t.splitPdf.uploader.loading1 : t.splitPdf.uploader.loading2}
              </h2>
              <p className="text-secondary animate-pulse">
                {t.splitPdf.uploader.loadingDesc}
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
              <h2 className="text-3xl font-bold mb-2">{t.splitPdf.uploader.success}</h2>
              <p className="text-secondary mb-10">{t.splitPdf.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download="dividido_xylopdf.zip"
                  className="px-8 py-5 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3"
                >
                  {t.splitPdf.uploader.btnDownload}
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={reset}
                  className="px-8 py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border"
                >
                  {t.splitPdf.uploader.btnReset}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Limit Modal */}
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
