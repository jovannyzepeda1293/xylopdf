"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle2, Loader2, AlertCircle, FilePlus, Trash2, Search, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { generateThumbnail } from "@/lib/pdf-preview";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';

interface FileWithPreview {
  file: File;
  preview: string;
}

interface Difference {
  page: number | string;
  line: number | string;
  before: string;
  after: string;
}

interface CompareResult {
  total_differences: number;
  differences: Difference[];
  filenames: string[];
}

export default function ComparePdfUploader() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
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
      
      if (files.length + newFiles.length > 2) {
        setErrorMessage(t.uploader.errorCompareLimit);
        setStatus("error");
        return;
      }

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

  const startComparison = async () => {
    if (files.length !== 2) {
      setErrorMessage(t.uploader.errorCompareLimit);
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
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 200);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/compare-pdfs`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t.uploader.errorFetching);
      }

      const data = await response.json();
      setProgress(100);
      setStatus("processing");
      setResult(data);

      // Increment usage
      await incrementUsage();

      setTimeout(() => {
        setStatus("completed");
      }, 1000);

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
    setResult(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden text-center">
        
        {(status === "uploading" || status === "processing") && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-1.5 bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20"
          />
        )}

        <AnimatePresence mode="wait">
          {(status === "idle" || status === "error") && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {status === "error" && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="border-2 border-dashed border-border rounded-3xl p-8 hover:border-primary transition-colors cursor-pointer group relative">
                  <input type="file" accept=".pdf" className="hidden" id="compare-1" onChange={handleFileChange} disabled={files.length >= 2} />
                  <label htmlFor="compare-1" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-accent rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <FilePlus className="w-8 h-8" />
                      </div>
                      <span className="font-bold">{t.uploader.dropzoneCompare}</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">{t.uploader.selectedFiles} ({files.length}/2)</h3>
                  <div className="space-y-3">
                    {files.map((f, i) => (
                      <div key={i} className="glass p-4 rounded-2xl flex items-center justify-between border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-primary/10 rounded overflow-hidden">
                             <img src={f.preview} alt="preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold truncate max-w-[180px]">{f.file.name}</p>
                            <p className="text-[10px] text-secondary">{(f.file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(i)} className="text-secondary hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {files.length === 0 && <div className="h-24 flex items-center justify-center border border-dashed rounded-2xl text-secondary/40 text-sm">{t.uploader.noFiles}</div>}
                  </div>
                </div>
              </div>

              {files.length === 2 && (
                <button 
                  onClick={startComparison}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  <Search className="w-6 h-6" />
                  {t.comparePdf.uploader.title}
                </button>
              )}
            </motion.div>
          )}

          {(status === "uploading" || status === "processing") && (
            <motion.div key="loading" className="py-20 flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
              <h2 className="text-2xl font-bold mb-2">{t.comparePdf.uploader.loading1}</h2>
              <p className="text-secondary">{t.comparePdf.uploader.loadingDesc}</p>
            </motion.div>
          )}

          {status === "completed" && result && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <div>
                  <h2 className="text-3xl font-black mb-1">{t.comparePdf.uploader.success}</h2>
                  <p className="text-secondary">{t.comparePdf.uploader.successDesc.replace("{f1}", result.filenames[0]).replace("{f2}", result.filenames[1])}</p>
                </div>
                <div className={cn("px-6 py-3 rounded-2xl font-bold text-lg", result.total_differences > 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500")}>
                  {result.total_differences} {t.comparePdf.uploader.differencesFound}
                </div>
              </div>

              {result.total_differences === 0 ? (
                <div className="py-16 text-center glass rounded-3xl border-dashed border-2">
                   <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold">{t.comparePdf.uploader.noDifferences}</h3>
                   <p className="text-secondary">{t.comparePdf.uploader.noDifferencesDesc}</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {result.differences.map((diff, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
                        <span className="bg-accent px-3 py-1 rounded-full">{t.comparePdf.uploader.pageLabel} {diff.page}</span>
                        <span className="bg-accent px-3 py-1 rounded-full">{t.comparePdf.uploader.lineLabel} {diff.line}</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><MinusCircle className="w-4 h-4 text-red-600" /></div>
                           <p className="text-[10px] uppercase font-bold text-red-600/60 mb-1">{t.comparePdf.uploader.beforeLabel}</p>
                           <p className="text-sm font-medium italic line-through opacity-70">{diff.before}</p>
                        </div>
                        <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><PlusCircle className="w-4 h-4 text-green-600" /></div>
                           <p className="text-[10px] uppercase font-bold text-green-600/60 mb-1">{t.comparePdf.uploader.afterLabel}</p>
                           <p className="text-sm font-bold text-green-700">{diff.after}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={reset}
                className="mt-10 w-full py-4 bg-accent text-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border flex items-center justify-center gap-2"
              >
                {t.uploader.btnResetCompare}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Limit Modal */}
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
