"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";

type ImageModalProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
};

export default function ImageModal({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentSrc = images[index];

  // --- navigation ---
  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [index, images.length, onIndexChange]);

  // --- keyboard shortcuts ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext, onClose]);

  // --- simple wheel zoom ---
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => {
      const next = Math.min(3, Math.max(1, s + delta));
      if (next === 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  };

  // --- drag when zoomed ---
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  // --- close when clicking backdrop ---
  const backdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
      onClick={backdropClick}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-100 hover:bg-slate-800"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev / Next arrows */}
      <button
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800"
        onClick={goPrev}
      >
        <ChevronLeft className="w-6 h-6 text-slate-100" />
      </button>
      <button
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800"
        onClick={goNext}
      >
        <ChevronRight className="w-6 h-6 text-slate-100" />
      </button>

      <div className="flex flex-col items-center gap-4">
        {/* Image container */}
        <div
          ref={containerRef}
          className="relative max-w-[90vw] max-h-[80vh] w-[min(480px,90vw)] aspect-[3/4] rounded-3xl border border-emerald-500/60 bg-slate-950/90 shadow-[0_0_40px_rgba(16,185,129,0.7)] overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* IMPORTANT: use the path exactly as provided */}
          <div
            className="relative w-full h-full"
            style={{
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transformOrigin: "center center",
              transition: isDragging.current ? "none" : "transform 0.15s ease-out",
            }}
          >
            <Image
              src={currentSrc}          // <-- NO extra `/art/` here
              alt="Artwork"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>

        {/* Download + index */}
        <div className="flex items-center gap-4 text-xs md:text-sm text-emerald-100">
          <a
            href={currentSrc}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-lime-300 text-slate-900 font-semibold shadow-[0_0_25px_rgba(190,242,100,0.8)] hover:bg-lime-200"
          >
            <Download className="w-4 h-4" />
            Download Image
          </a>
          <span className="text-emerald-200/80">
            {index + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
