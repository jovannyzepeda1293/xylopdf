"use client";

import React, { useState } from 'react';
import {
  FileText, Upload, Download, Loader2, X,
  CheckCircle2, AlertCircle, RefreshCw, Eraser, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/I18nContext';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function WatermarkUploader() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');
      // Trigger removal automatically
      startRemoval(selectedFile);
    }
  };

  const startRemoval = async (fileToProcess: File) => {
    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', fileToProcess);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 5 : 90));
      }, 300);

      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/remove-watermark', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || t.uploader.errorFetching);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('completed');
    } catch (err: any) {
      setErrorMessage(err.message || t.uploader.errorUnexpected);
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
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
            className="absolute top-0 left-0 h-1.5 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20"
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
                className="border-2 border-dashed border-border rounded-[2rem] p-16 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer group"
                onClick={() => document.getElementById('watermark-upload')?.click()}
              >
                <input
                  type="file"
                  id="watermark-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-6 bg-cyan-500/10 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
                  <Eraser className="w-12 h-12 text-cyan-500" />
                </div>
                <p className="text-secondary max-w-sm mx-auto mb-8">
                  {t.removeWatermark.uploader.intro}
                </p>
                <div className="py-3 px-8 bg-background border border-border rounded-xl inline-flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  {t.uploader.btnSelect}
                </div>
              </div>
            </motion.div>
          )}

          {(status === 'processing' || status === 'error' || (status === 'idle' && file)) && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-cyan-500/10 rounded-2xl">
                    <FileText className="w-8 h-8 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">
                      {file?.name}
                    </h3>
                    <p className="text-secondary text-sm">{file ? formatBytes(file.size) : ''}</p>
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
                    disabled={status === 'processing'}
                    className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {status === 'processing' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    {t.removeWatermark.uploader.title}
                  </button>
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              )}
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

              <h2 className="text-4xl font-black mb-4">{t.removeWatermark.uploader.success}</h2>
              <p className="text-secondary mb-12">{t.removeWatermark.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download={`limpio_${file.name}`}
                  className="px-12 py-5 bg-cyan-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-3"
                >
                  {t.removeWatermark.uploader.btnDownload}
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
