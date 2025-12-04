"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ImageModalProps = {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function ImageModal({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  const [zoomed, setZoomed] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const src = images[currentIndex];

  useEffect(() => {
    setZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev]);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchEndX.current - touchStartX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) onNext();
      else onPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-2 md:px-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-slate-950/90 border border-emerald-700/80 rounded-3xl shadow-[0_0_60px_rgba(56,189,248,0.5)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-800/70 text-[0.8rem] text-emerald-100">
          <div className="font-semibold">Image Viewer</div>

          <div className="flex items-center gap-2">
            {/* Download button */}
            <a
              href={src}
              download
              className="px-3 py-1.5 rounded-full bg-lime-300 text-slate-900 text-[0.75rem] font-semibold border border-lime-300 hover:bg-lime-200"
            >
              ⬇ Download
            </a>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900/90 border border-emerald-700/80 text-xs hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Image */}
        <div
          className="relative flex-1 flex items-center justify-center bg-slate-950"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => onPrev()}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/80 border border-emerald-700/80 text-lg text-emerald-100 hover:bg-slate-800"
          >
            ‹
          </button>

          <div
            className={`relative max-h-[80vh] max-w-full transition-transform duration-200 ${
              zoomed ? "scale-110 md:scale-125 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            }`}
            onClick={() => setZoomed((z) => !z)}
          >
            <Image
              src={src}
              alt={`Artwork ${currentIndex + 1}`}
              width={1200}
              height={1200}
              className="object-contain max-h-[80vh] w-auto h-auto"
            />
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => onNext()}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/80 border border-emerald-700/80 text-lg text-emerald-100 hover:bg-slate-800"
          >
            ›
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-emerald-800/70 text-[0.75rem] text-emerald-200/85 bg-slate-950/95">
          <span>
            Image {currentIndex + 1} of {images.length}
          </span>
          <span className="text-[0.7rem] text-cyan-300/85">
            Swipe or use ← → to navigate
          </span>
        </div>
      </div>
    </div>
  );
}
