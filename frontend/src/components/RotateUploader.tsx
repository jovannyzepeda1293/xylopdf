"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, File, X, CheckCircle2, Loader2,
  AlertCircle, FilePlus, Trash2, RotateCw,
  RotateCcw, RefreshCcw
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { generateThumbnail } from "@/lib/pdf-preview";
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';

import { useI18n } from "@/lib/i18n/I18nContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star } from "lucide-react";

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function RotateUploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [file, setFile] = useState<FileWithPreview | null>(null);
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

  const rotationOptions = [
    { label: t.rotatePdf.uploader.angle90, angle: 90, icon: RotateCw },
    { label: t.rotatePdf.uploader.angle180, angle: 180, icon: RefreshCcw },
    { label: t.rotatePdf.uploader.angle270, angle: 270, icon: RotateCcw },
  ];

  // Custom states for rotation
  const [pages, setPages] = useState("");
  const [selectedAngle, setSelectedAngle] = useState(90);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        setErrorMessage(t.rotatePdf.uploader.errorOnlyPdf);
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

  const startRotation = async () => {
    if (!file) {
      setErrorMessage(t.rotatePdf.uploader.errorSelectFile);
      setStatus("error");
      return;
    }

    // Check usage limit
    const isAllowed = await checkLimit();
    if (!isAllowed) return;

    setStatus("uploading");
    setErrorMessage("");
    setProgress(0);

    // Optional page validation if not empty
    if (pages.trim()) {
      const rangeRegex = /^(\d+(\s*-\s*\d+)?\s*(,\s*\d+(\s*-\s*\d+)?\s*)*)$/;
      if (!rangeRegex.test(pages.trim())) {
        setErrorMessage(t.rotatePdf.uploader.errorInvalidRange);
        setStatus("error");
        return;
      }
      if (pages.includes("0")) {
        setErrorMessage(t.rotatePdf.uploader.errorZeroPage);
        setStatus("error");
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file.file);

    // Add query params for rotation
    const queryParams = new URLSearchParams({
      pages: pages.trim(),
      angle: selectedAngle.toString()
    });

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 200);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/rotate-pdf?${queryParams}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.rotatePdf.uploader.errorFetching || "Error");
      }

      setProgress(100);
      setStatus("processing");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Increment usage
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
    setProgress(0);
    setErrorMessage("");
    setPages("");
    setSelectedAngle(90);
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side: Upload & Selection */}
                <div className="space-y-8">
                  <div
                    className="border-2 border-dashed border-border rounded-3xl p-8 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center bg-accent/30"
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer w-full h-full">
                      <div className="flex flex-col items-center gap-4 py-6">
                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Upload className="w-8 h-8" />
                        </div>
                        <span className="font-semibold text-lg">
                          {file ? t.rotatePdf.uploader.changeFile : t.rotatePdf.uploader.chooseFile}
                        </span>
                        <p className="text-xs text-secondary/60">{t.rotatePdf.uploader.uploadHint}</p>
                      </div>
                    </label>
                  </div>

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 glass border border-border/50 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-blue-500/10 rounded-lg overflow-hidden border border-border relative">
                          {file.preview ? (
                            <img src={file.preview} alt="PDF Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <File className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm truncate max-w-[120px]">{file.file.name}</span>
                          <span className="text-[10px] text-secondary">{(file.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button onClick={removeFile} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Right Side: Options */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-3 uppercase tracking-wider">
                      {t.rotatePdf.uploader.rotationAngle}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {rotationOptions.map((opt) => (
                        <button
                          key={opt.angle}
                          onClick={() => setSelectedAngle(opt.angle)}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                            selectedAngle === opt.angle
                              ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10"
                              : "border-border bg-accent/20 hover:border-primary/50 text-secondary"
                          )}
                        >
                          <opt.icon className={cn("w-6 h-6 group-hover:scale-110 transition-transform", selectedAngle === opt.angle && "animate-pulse")} />
                          <span className="text-[10px] font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-3 uppercase tracking-wider">
                      {t.rotatePdf.uploader.pageRange}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t.rotatePdf.uploader.pageRangePlaceholder}
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        className="w-full bg-accent/20 border-2 border-border rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all font-medium placeholder:text-secondary/30"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <File className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] text-secondary/60 ml-2">
                      {t.rotatePdf.uploader.pageRangeHint}
                    </p>
                  </div>

                  {file && (
                    <div className="space-y-3 mt-4">
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={startRotation}
                        className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.03] transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {t.rotatePdf.uploader.title}
                          <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
                  <div className="w-24 h-24 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    {progress}%
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {status === "uploading" ? t.rotatePdf.uploader.loading1 : t.rotatePdf.uploader.loading2}
              </h2>
              <p className="text-secondary max-w-sm mx-auto">
                {t.rotatePdf.uploader.loadingDesc}
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
              <div className="mb-8 flex justify-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-28 h-28 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/30 shadow-2xl shadow-green-500/20"
                >
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </motion.div>
                <div className="absolute -top-2 right-1/4 animate-bounce">
                  <div className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full">{t.rotatePdf.uploader.successBadge || "DONE"}</div>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-3">{t.rotatePdf.uploader.success}</h2>
              <p className="text-secondary mb-12 max-w-md mx-auto">{t.rotatePdf.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download={`rotado_${file?.file.name}`}
                  className="px-10 py-5 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95"
                >
                  {t.rotatePdf.uploader.btnDownload}
                  <Upload className="w-5 h-5 rotate-180" />
                </a>
                <button
                  onClick={reset}
                  className="px-10 py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" />
                  {t.rotatePdf.uploader.btnReset}
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
