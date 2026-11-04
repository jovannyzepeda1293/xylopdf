"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FileText, Upload, Download, Loader2, X, Plus,
  GripVertical, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as pdfjs from 'pdfjs-dist';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useUsageLimit } from '@/hooks/useUsageLimit';
import LimitModal from '@/components/LimitModal';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageItem {
  id: string;
  index: number;
  thumbnail: string;
}

interface SortablePageProps {
  page: PageItem;
  onRemove: (id: string) => void;
  pageLabel: string;
}

function SortablePage({ page, onRemove, pageLabel }: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group bg-background/40 backdrop-blur-sm rounded-2xl border border-border/50 p-2 transition-all hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5",
        isDragging && "shadow-2xl border-teal-500/50"
      )}
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 relative">
        <img
          src={page.thumbnail}
          alt={`${pageLabel} ${page.index + 1}`}
          className="w-full h-full object-contain pointer-events-none"
        />
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10"
        >
          <GripVertical className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-white border border-white/10">
          {page.index + 1}
        </div>
        <button
          onClick={() => onRemove(page.id)}
          className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="mt-2 text-center text-[10px] font-medium text-secondary truncate px-1">
        {pageLabel} {page.index + 1}
      </div>
    </div>
  );
}

export default function OrganizePdfUploader() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'organizing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { 
    checkLimit, 
    incrementUsage, 
    showLimitModal, 
    setShowLimitModal, 
    usageInfo, 
    isLoggedIn 
  } = useUsageLimit();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateThumbnails = async (pdfFile: File) => {
    setStatus('loading');
    setErrorMessage('');
    const arrayBuffer = await pdfFile.arrayBuffer();

    try {
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const newPages: PageItem[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;

        newPages.push({
          id: `page-${i}-${Date.now()}`,
          index: i - 1, // Store original index (0-based) for the server
          thumbnail: canvas.toDataURL('image/webp', 0.6),
        });

        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setPages(newPages);
      setStatus('idle');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(t.uploader.errorLoadingPdf);
      setStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      generateThumbnails(selectedFile);
    }
  };

  const onDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const generatePdf = async () => {
    if (!file || pages.length === 0) return;

    // Check usage limit
    const isAllowed = await checkLimit();
    if (!isAllowed) return;

    setStatus('organizing');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    // Send original indices in the new order
    const order = pages.map(p => p.index);
    formData.append('order', JSON.stringify(order));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/organize-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || t.uploader.errorFetching);
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
    setPages([]);
    setStatus('idle');
    setDownloadUrl(null);
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">

        {/* Connection status dot */}
        <div className="absolute top-4 right-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Live Processing Engine</span>
        </div>

        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="relative inline-block mb-8">
                <Loader2 className="w-20 h-20 text-teal-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                  {progress}%
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-glow">{t.organizePdf.uploader.preparing}</h3>
              <p className="text-secondary">{t.organizePdf.uploader.preparingDesc}</p>
            </motion.div>
          )}

          {(status === 'idle' || status === 'error') && !file && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div
                className="border-2 border-dashed border-border rounded-[2rem] p-16 transition-all hover:border-teal-500/50 hover:bg-teal-500/5 cursor-pointer group"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-6 bg-teal-500/10 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-12 h-12 text-teal-500" />
                </div>
                <p className="text-secondary max-w-sm mx-auto mb-8">
                  {t.organizePdf.uploader.intro}
                </p>
                <div className="py-3 px-8 bg-background border border-border rounded-xl inline-flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  {t.uploader.btnSelect}
                </div>
              </div>

              {status === 'error' && (
                <div className="mt-6 flex items-center justify-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              )}
            </motion.div>
          )}

          {(status === 'idle' || status === 'organizing' || status === 'error') && file && pages.length > 0 && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-500" />
                    {file.name}
                  </h3>
                  <p className="text-secondary text-sm">{t.organizePdf.uploader.dragDesc}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={reset}
                    className="p-3 text-secondary hover:text-foreground transition-colors"
                    title={t.organizePdf.uploader.changeFile}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={generatePdf}
                    disabled={status === 'organizing'}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {status === 'organizing' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    {t.organizePdf.uploader.title}
                  </button>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                  <SortableContext
                    items={pages.map((p) => p.id)}
                    strategy={rectSortingStrategy}
                  >
                    {pages.map((page) => (
                      <SortablePage
                        key={page.id}
                        page={page}
                        onRemove={removePage}
                        pageLabel={t.organizePdf.uploader.pageLabel}
                      />
                    ))}
                  </SortableContext>
                </div>

                <DragOverlay adjustScale={true}>
                  {activeId ? (
                    <div className="bg-background/80 backdrop-blur-xl rounded-2xl border-2 border-teal-500 p-2 shadow-2xl scale-110 ring-4 ring-teal-500/20">
                      <img
                        src={pages.find(p => p.id === activeId)?.thumbnail}
                        alt="Dragging"
                        className="w-full aspect-[3/4] object-contain rounded-xl"
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}
            </motion.div>
          )}

          {status === 'completed' && (
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
              <h2 className="text-4xl font-bold mb-4">{t.organizePdf.uploader.success}</h2>
              <p className="text-secondary mb-12">{t.organizePdf.uploader.successDesc}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={downloadUrl || "#"}
                  download={`organizado_${file?.name || 'documento.pdf'}`}
                  className="px-12 py-5 bg-teal-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3"
                >
                  {t.organizePdf.uploader.btnDownload}
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
