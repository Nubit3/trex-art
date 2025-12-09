"use client";
import { useState } from "react";
import ImageModal from "./ImageModal";

type ArtSectionProps = {
  id: string;
  title: string;
  images: string[];
  variant?: "gallery" | "comics";
  enableRating?: boolean; 
};

export default function ArtSection({ id, title, images, variant = "gallery" }: ArtSectionProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const isComic = variant === "comics";

  return (
    <section id={id} className="w-full">
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
        <h3 className="text-3xl md:text-4xl font-light tracking-tighter text-white">
          {title}
        </h3>
        <span className="font-mono text-xs text-cyan-500">[{images.length} ASSETS]</span>
      </div>

      <div className={
        isComic 
          // COMIC FIX: Changed to a GRID (3 per row) so they aren't huge.
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          // GALLERY: Masonry
          : "columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
      }>
        {images.map((src, i) => (
          <div
            key={src + i}
            onClick={() => setModalIndex(i)}
            className={`
              relative overflow-hidden cursor-pointer rounded-lg break-inside-avoid group
              ${isComic 
                 // COMIC CARD STYLE
                 ? "w-full border-2 border-slate-700 bg-slate-900 shadow-xl hover:-translate-y-2 transition-transform duration-300" 
                 // GALLERY CARD STYLE
                 : "bg-slate-900 border border-white/10 hover:border-cyan-500 transition-colors duration-300 mb-4"
              }
            `}
          >
            <img 
              src={src} 
              alt={`Art ${i}`}
              className={`
                block w-full h-auto
                ${!isComic && "hover:opacity-90 transition-opacity"}
              `}
              loading="lazy"
            />
            
            {/* COMIC LABEL */}
            {isComic && (
              <div className="p-4 bg-[#0a0a0a] border-t border-slate-800">
                <p className="text-emerald-500 font-mono text-xs mb-1">ISSUE #{i + 1}</p>
                <p className="text-white font-bold text-sm">The Rexy Chronicles</p>
              </div>
            )}

            {/* GALLERY HOVER OVERLAY */}
            {!isComic && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                 <p className="text-xs font-mono text-cyan-400">IMG_0{i}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalIndex !== null && (
        <ImageModal
          images={images}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onNext={() => setModalIndex((prev) => prev === null ? null : (prev + 1) % images.length)}
          onPrev={() => setModalIndex((prev) => prev === null ? null : (prev - 1 + images.length) % images.length)}
        />
      )}
    </section>
  );
}
