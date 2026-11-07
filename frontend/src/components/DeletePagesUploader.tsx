"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText, Upload, Download, Loader2, X,
  CheckCircle2, AlertCircle, RefreshCw, Trash2, File as FileIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateThumbnail } from "@/lib/pdf-preview";
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';
import { useI18n } from "@/lib/i18n/I18nContext";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function DeletePagesUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { t } = useI18n();
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');

      const thumb = await generateThumbnail(selectedFile);
      setThumbnail(thumb);
    }
  };

  const handleDeletePages = async () => {
    if (!file || !pagesToDelete) {
      if (!file) setErrorMessage(t.uploader.errorSelectFile);
      else setErrorMessage(t.deletePages.uploader.errorMissingPages);
      setStatus('error');
      return;
    }

    // Check usage limit
    const isAllowed = await checkLimit();
    if (!isAllowed) return;

    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pages', pagesToDelete);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : 90));
      }, 200);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/delete-pages`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || t.deletePages.uploader.errorFetching);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Increment usage
      await incrementUsage();

      setStatus('completed');
    } catch (err: any) {
      setErrorMessage(err.message || t.uploader.errorUnexpected);
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setThumbnail("");
    setPagesToDelete('');
    setStatus('idle');
    setDownloadUrl(null);
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">

        {/* Progress Bar Top */}
        {status === 'processing' && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-1.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-20"
          />
        )}

        <AnimatePresence mode="wait">
          {(status === 'idle' || status === 'error') && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              {status === 'error' && (
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
                {/* Left: Upload Zone */}
                <div>
                  {!file ? (
                    <div
                      className="border-2 border-dashed border-border rounded-3xl p-12 transition-all hover:border-red-500/50 hover:bg-red-500/5 cursor-pointer group h-full flex flex-col items-center justify-center text-center bg-accent/30"
                      onClick={() => document.getElementById('delete-upload')?.click()}
                    >
                      <input
                        type="file"
                        id="delete-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center gap-4 py-10">
                        <div className="p-4 bg-red-500/10 rounded-full group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                          <Trash2 className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-lg">{t.deletePages.uploader.chooseFile}</span>
                        <span className="text-sm text-secondary">{t.deletePages.uploader.uploadHint}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="glass border border-border/50 rounded-3xl p-8 text-center h-full flex flex-col items-center justify-center relative group">
                      <button
                        onClick={reset}
                        className="absolute top-4 right-4 p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="w-32 h-44 bg-red-500/5 rounded-xl border border-border shadow-2xl overflow-hidden mb-6 relative">
                        {thumbnail ? (
                          <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full flex items-center justify-center italic text-xs text-secondary/30">{t.deletePages.uploader.loading}</div>
                        )}
                        <div className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-md shadow-lg">
                          <FileText className="w-4 h-4 text-white" />
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
                      <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-secondary text-left">
                        {t.deletePages.uploader.pagesLabel}
                      </label>
                      <input
                        type="text"
                        value={pagesToDelete}
                        onChange={(e) => setPagesToDelete(e.target.value)}
                        placeholder={t.deletePages.uploader.pagesPlaceholder}
                        className="w-full bg-accent border border-border rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-secondary/40 font-medium"
                        disabled={!file}
                      />
                      <p className="text-[11px] text-secondary mt-3 leading-relaxed italic text-left">
                        {t.deletePages.uploader.pagesHint}
                      </p>
                    </div>

                    {file && (
                      <div className="space-y-3">
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={handleDeletePages}
                          className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                        >
                          {t.deletePages.uploader.btnProcess}
                          <Trash2 className="w-5 h-5" />
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

          {status === 'processing' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <Loader2 className="w-20 h-20 text-red-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{progress}%</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">{t.deletePages.uploader.loadingTitle}</h2>
              <p className="text-secondary animate-pulse">
                {t.deletePages.uploader.loadingDesc}
              </p>
            </motion.div>
          )}

          {status === 'completed' && file && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="mb-10 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/30">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <h2 className="text-4xl font-black mb-4">{t.deletePages.uploader.success}</h2>
              <p className="text-secondary mb-12">{t.deletePages.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download={`modificado_${file.name}`}
                  className="px-12 py-5 bg-red-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-3"
                >
                  {t.deletePages.uploader.btnDownload}
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={reset}
                  className="px-12 py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border"
                >
                  {t.deletePages.uploader.btnReset}
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
