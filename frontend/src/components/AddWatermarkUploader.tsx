"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Upload, Download, Loader2, X,
  CheckCircle2, AlertCircle, RefreshCw, Type, Image as ImageIcon,
  Settings2, Move, Maximize, RotateCw, Type as TypeIcon, Palette,
  Grid3X3, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateThumbnail } from '@/lib/pdf-preview';
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';
import { useI18n } from '@/lib/i18n/I18nContext';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const AddWatermarkUploader = () => {
  const { t } = useI18n();

  const positions = [
    { id: 'top-left', label: t.watermark.uploader.posTL },
    { id: 'top-right', label: t.watermark.uploader.posTR },
    { id: 'center', label: t.watermark.uploader.posC },
    { id: 'bottom-left', label: t.watermark.uploader.posBL },
    { id: 'bottom-right', label: t.watermark.uploader.posBR },
  ];

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { 
    checkLimit, 
    incrementUsage, 
    showLimitModal, 
    setShowLimitModal, 
    usageInfo, 
    isLoggedIn 
  } = useUsageLimit();

  // Watermark Settings
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('MARCA DE AGUA');
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState('#ff0000');
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(-45);
  const [position, setPosition] = useState('center');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scale, setScale] = useState(0.5);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');
      const thumbnail = await generateThumbnail(selectedFile);
      setPreviewUrl(thumbnail);
    }
  };

  const handleImageWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage && selectedImage.type.startsWith('image/')) {
      setImageFile(selectedImage);
      const url = URL.createObjectURL(selectedImage);
      setImagePreview(url);
    }
  };

  const startProcessing = async () => {
    if (!file) return;
    if (mode === 'text' && !text) {
      setErrorMessage(t.watermark.uploader.errorMissingText);
      setStatus('error');
      return;
    }
    if (mode === 'image' && !imageFile) {
      setErrorMessage(t.watermark.uploader.errorMissingImage);
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
    formData.append('mode', mode);
    formData.append('opacity', opacity.toString());
    formData.append('rotation', rotation.toString());
    formData.append('position', position);

    if (mode === 'text') {
      formData.append('text', text);
      formData.append('font_size', fontSize.toString());
      formData.append('color', color);
    } else if (mode === 'image' && imageFile) {
      formData.append('image_file', imageFile);
      formData.append('scale', scale.toString());
    }

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 5 : 90));
      }, 300);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/add-watermark`, {
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

      // Increment usage
      await incrementUsage();
      
      // Automatic download
      const link = document.createElement('a');
      link.href = url;
      link.download = `marca_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('completed');
    } catch (err: any) {
      setErrorMessage(err.message || t.uploader.errorUnexpected);
      setStatus('error');
    }
  };

  // Reset status to idle when settings change so the button becomes "Procesar" again
  useEffect(() => {
    if (status === 'completed') {
      setStatus('idle');
    }
  }, [text, fontSize, color, opacity, rotation, position, scale, mode, imageFile]);

  const handleMainButtonClick = () => {
    if (status === 'completed' && downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `marca_${file?.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      startProcessing();
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setDownloadUrl(null);
    setErrorMessage('');
    setProgress(0);
    setImageFile(null);
    setImagePreview(null);
  };

  // Helper for real-time preview positioning
  const getPreviewPositionClass = () => {
    switch(position) {
      case 'top-left': return 'top-4 left-4 text-left items-start';
      case 'top-right': return 'top-4 right-4 text-right items-end';
      case 'bottom-left': return 'bottom-4 left-4 text-left items-start';
      case 'bottom-right': return 'bottom-4 right-4 text-right items-end';
      default: return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar Top */}
        {(status === 'processing') && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-1.5 bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20"
          />
        )}

        <AnimatePresence mode="wait">
          {status === 'idle' && !file ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div
                className="border-2 border-dashed border-border rounded-[2rem] p-16 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer group"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-6 bg-primary/10 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-12 h-12 text-primary" />
                </div>
                <p className="text-secondary max-w-sm mx-auto mb-8">
                  Personaliza tus documentos con texto o imágenes transparentes.
                </p>
                <div className="py-3 px-8 bg-background border border-border rounded-xl inline-flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Seleccionar PDF
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Preview Side */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-primary" />
                    {t.watermark.uploader.previewTitle}
                  </h3>
                  {file && (
                    <span className="text-xs text-secondary bg-accent px-3 py-1 rounded-full">
                      {file.name} ({t.watermark.uploader.firstPage})
                    </span>
                  )}
                </div>
                
                <div className="relative aspect-[3/4] bg-neutral-900 rounded-3xl border border-border overflow-hidden shadow-inner flex items-center justify-center p-4 group">
                  {previewUrl ? (
                    <div className="relative w-full h-full shadow-2xl">
                      <img src={previewUrl} className="w-full h-full object-contain" alt="Original PDF Preview" />
                      
                      {/* Watermark Overlay (Simulation) */}
                      <div className={cn("absolute flex flex-col pointer-events-none transition-all duration-300", getPreviewPositionClass())}>
                        {mode === 'text' ? (
                          <div 
                            style={{ 
                              color: color, 
                              fontSize: `${fontSize / 2}px`, 
                              opacity: opacity,
                              transform: `rotate(${rotation}deg)`,
                              fontWeight: 'bold',
                              lineHeight: 1
                            }}
                          >
                            {text || 'MARCA DE AGUA'}
                          </div>
                        ) : (
                          imagePreview && (
                            <img 
                              src={imagePreview} 
                              alt="Watermark Preview"
                              style={{
                                width: `${scale * 100}%`,
                                opacity: opacity,
                                transform: `rotate(${rotation}deg)`
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
                  )}
                </div>


                {status === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Controls Side */}
              <div className="space-y-8 py-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black">{t.watermark.uploader.editorTitle}</h3>
                  <button onClick={reset} className="p-2 text-secondary hover:text-red-500 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex p-1.5 bg-accent/50 rounded-2xl gap-1">
                  <button 
                    onClick={() => setMode('text')}
                    className={cn(
                      "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all",
                      mode === 'text' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-secondary hover:bg-accent"
                    )}
                  >
                    <TypeIcon className="w-4 h-4" />
                    {t.watermark.uploader.textTab}
                  </button>
                  <button 
                    onClick={() => setMode('image')}
                    className={cn(
                      "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all",
                      mode === 'image' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-secondary hover:bg-accent"
                    )}
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t.watermark.uploader.imageTab}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Mode Specific Controls */}
                  {mode === 'text' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-secondary mb-2 block uppercase tracking-wider">{t.watermark.uploader.textLabel}</label>
                        <input 
                          type="text" 
                          value={text} 
                          onChange={(e) => setText(e.target.value)}
                          className="w-full bg-accent/50 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-all font-medium"
                          placeholder={t.watermark.uploader.textPlaceholder}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-secondary mb-2 block uppercase tracking-wider">{t.watermark.uploader.sizeLabel}</label>
                          <div className="flex items-center gap-3">
                            <input 
                              type="range" min="10" max="200" value={fontSize} 
                              onChange={(e) => setFontSize(parseInt(e.target.value))}
                              className="flex-grow accent-primary"
                            />
                            <span className="text-xs font-mono bg-accent px-2 py-1 rounded">{fontSize}px</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-bold text-secondary mb-2 block uppercase tracking-wider">{t.watermark.uploader.colorLabel}</label>
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" value={color} 
                              onChange={(e) => setColor(e.target.value)}
                              className="w-10 h-10 rounded-lg overflow-hidden border-none p-0 cursor-pointer"
                            />
                            <span className="text-xs font-mono bg-accent px-2 py-1 rounded uppercase">{color}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center text-center group"
                        onClick={() => document.getElementById('watermark-img')?.click()}
                      >
                        <input type="file" id="watermark-img" accept="image/*" className="hidden" onChange={handleImageWatermarkChange} />
                        {imagePreview ? (
                          <div className="relative w-24 h-24 overflow-hidden rounded-xl border border-border">
                            <img src={imagePreview} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <>
                            <div className="p-3 bg-accent rounded-full mb-3 group-hover:text-primary transition-colors">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold">{t.watermark.uploader.imageUploadLabel}</span>
                          </>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-bold text-secondary mb-2 block uppercase tracking-wider">{t.watermark.uploader.scaleLabel}</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="range" min="0.1" max="2" step="0.1" value={scale} 
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="flex-grow accent-primary"
                          />
                          <span className="text-xs font-mono bg-accent px-2 py-1 rounded">{Math.round(scale * 100)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <hr className="border-border/50" />

                  {/* Common Controls */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-secondary mb-2 block uppercase tracking-wider flex items-center gap-2">
                        <Palette className="w-4 h-4" /> {t.watermark.uploader.opacityLabel}
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" min="0" max="1" step="0.1" value={opacity} 
                          onChange={(e) => setOpacity(parseFloat(e.target.value))}
                          className="flex-grow accent-primary"
                        />
                        <span className="text-xs font-mono bg-accent px-2 py-1 rounded">{Math.round(opacity * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-2 block uppercase tracking-wider flex items-center gap-2">
                        <RotateCw className="w-4 h-4" /> {t.watermark.uploader.rotationLabel}
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" min="-180" max="180" value={rotation} 
                          onChange={(e) => setRotation(parseInt(e.target.value))}
                          className="flex-grow accent-primary"
                        />
                        <span className="text-xs font-mono bg-accent px-2 py-1 rounded">{rotation}°</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-secondary mb-4 block uppercase tracking-wider flex items-center gap-2">
                      <Grid3X3 className="w-4 h-4" /> {t.watermark.uploader.positionLabel}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {positions.map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setPosition(pos.id)}
                          className={cn(
                            "py-2 px-3 rounded-xl border text-xs font-bold transition-all",
                            position === pos.id 
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                              : "bg-accent/30 border-border text-secondary hover:bg-accent"
                          )}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleMainButtonClick}
                    disabled={status === 'processing'}
                    className={cn(
                      "w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-3",
                      status === 'completed' ? "bg-green-600 text-white shadow-green-500/30" : "bg-primary text-white shadow-primary/30",
                      status !== 'processing' && "hover:scale-[1.02] active:scale-[0.98]",
                      status === 'processing' && "opacity-50"
                    )}
                  >
                    {status === 'processing' ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {t.watermark.uploader.loading1}
                      </>
                    ) : status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        {t.watermark.uploader.btnDownloaded}
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6" />
                        {t.watermark.uploader.btnProcess}
                      </>
                    )}
                  </button>
                  
                  {status === 'completed' && (
                    <motion.button
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={reset}
                      className="w-full mt-4 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-bold border border-border hover:bg-accent/80 transition-all"
                    >
                      {t.watermark.uploader.btnReset}
                    </motion.button>
                  )}

                  <p className="text-center text-secondary text-xs mt-4">
                    {t.watermark.uploader.footerPrivacy}
                  </p>
                </div>
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
        />
      </div>
    </div>
  );
};

export default AddWatermarkUploader;
