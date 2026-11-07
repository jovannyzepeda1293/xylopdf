"use client";

import React, { useState } from 'react';
import {
  FileText, Upload, Download, Loader2, X,
  CheckCircle2, AlertCircle, RefreshCw, Zap, TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { useI18n } from '@/lib/i18n/I18nContext';

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function CompressPdfUploader() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');
      // Trigger compression automatically
      startCompression(selectedFile);
    } else if (selectedFile) {
      setErrorMessage(t.compressPdf.uploader.errorOnlyPdf);
      setStatus('error');
    }
  };

  const startCompression = async (fileToCompress: File) => {
    // Check usage limit
    const isAllowed = await checkLimit();
    if (!isAllowed) {
      setStatus('idle');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', fileToCompress);

    try {
      // Simulate fake progress for UX
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 5 : 90));
      }, 300);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/compress-pdf`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || t.compressPdf.uploader.errorFetching);
      }

      const blob = await response.blob();
      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      // Increment usage
      await incrementUsage();
      
      setStatus('completed');
    } catch (err: any) {
      setErrorMessage(err.message || t.compressPdf.uploader.errorConnection);
      setStatus('error');
    }
  };

  const handleCompress = () => {
    if (file) startCompression(file);
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setDownloadUrl(null);
    setCompressedSize(null);
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">

        {/* Progress Bar Top */}
        {(status === 'uploading' || status === 'processing') && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-1.5 bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)] z-20"
          />
        )}

        <AnimatePresence mode="wait">
          {status === 'idle' && !file && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div
                className="border-2 border-dashed border-border rounded-[2rem] p-16 transition-all hover:border-teal-500/50 hover:bg-teal-500/5 cursor-pointer group"
                onClick={() => document.getElementById('compress-upload')?.click()}
              >
                <input
                  type="file"
                  id="compress-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-6 bg-teal-500/10 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-12 h-12 text-teal-500" />
                </div>
                <p className="text-secondary max-w-sm mx-auto mb-8">
                  {t.compressPdf.uploader.uploadHint}
                </p>
                <div className="py-3 px-8 bg-background border border-border rounded-xl inline-flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  {t.compressPdf.uploader.chooseFile}
                </div>
              </div>
            </motion.div>
          )}

          {(status === 'idle' || status === 'uploading' || status === 'processing' || status === 'error') && file && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-teal-500/10 rounded-2xl">
                    <FileText className="w-8 h-8 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">
                      {file.name}
                    </h3>
                    <p className="text-secondary text-sm">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={reset}
                    className="p-3 text-secondary hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCompress}
                    disabled={status === 'uploading' || status === 'processing'}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {(status === 'uploading' || status === 'processing') ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                    {t.compressPdf.uploader.title}
                  </button>

                  {!session?.user?.subscriptionActive && (
                    <Link
                      href="/unlimited-access"
                      className="px-6 py-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl font-bold hover:bg-amber-500/20 transition-all flex items-center gap-2 group text-sm"
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                      {t.navbar.unlimitedAccess}
                    </Link>
                  )}
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              )}
            </motion.div>
          )}

          {status === 'completed' && file && compressedSize && (
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

              <h2 className="text-4xl font-black mb-10">{t.compressPdf.uploader.success}</h2>

              {/* Comparison Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 glass border border-border/50 rounded-3xl">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">{t.compressPdf.uploader.originalLabel}</p>
                  <p className="text-2xl font-black">{formatBytes(file.size)}</p>
                </div>

                <div className="p-6 bg-teal-500/10 border border-teal-500/30 rounded-3xl relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <TrendingDown className="w-24 h-24 text-teal-500" />
                  </div>
                  <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">{t.compressPdf.uploader.reductionLabel}</p>
                  <p className="text-4xl font-black text-teal-500">
                    -{Math.round(((file.size - compressedSize) / file.size) * 100)}%
                  </p>
                </div>

                <div className="p-6 glass border border-border/50 rounded-3xl">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">{t.compressPdf.uploader.compressedLabel}</p>
                  <p className="text-2xl font-black">{formatBytes(compressedSize)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download={`comprimido_${file.name}`}
                  className="px-12 py-5 bg-teal-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3"
                >
                  {t.compressPdf.uploader.btnDownload}
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={reset}
                  className="px-12 py-5 bg-accent text-accent-foreground rounded-2xl font-bold hover:bg-accent/80 transition-all border border-border"
                >
                  {t.compressPdf.uploader.btnReset}
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
          isExpired={usageInfo?.isExpired}
        />
      </div>
    </div>
  );
}
