"use client";
import { useState } from "react";
import ImageModal from "./ImageModal";

// --- YOUR CUSTOM DESCRIPTIONS GO HERE ---
// Format: "filename.jpg": "Your Description Here",
const ART_DESCRIPTIONS: Record<string, string> = {
  // Gallery Images
  "frustrated-rextoon-dino.jpg": "When the floor price drops 50% overnight.",
  "chill-pill-web3-meme.jpg": "Take a chill pill, WAGMI.",
  "rextoon-retro-game-art-1.jpg": "Concept art for the infinite runner game.",
  "green-trex-mascot-running.jpg": "Rexy doing his daily cardio.",
  "pixel-art-dino-character.jpg": "8-bit nostalgia style.",
  "web3-comic-style-art.jpg": "Detailed line work for the upcoming issue.",
  "rextoon-featured-nft-art.jpg": "Featured piece from the genesis collection.",
  "rextoon-sketch-01.jpg": "Early morning warm-up sketch.",
  
  // You can add more here following the same pattern...
};

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

  // Helper to get description from filename
  const getDescription = (src: string) => {
    // splits "/art/image.jpg" -> "image.jpg"
    const filename = src.split('/').pop() || "";
    // Returns your text, or nothing if not found
    return ART_DESCRIPTIONS[filename] || ""; 
  };

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
          // COMIC FIX: Grid 3 per row
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          // GALLERY: Masonry layout
          : "columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
      }>
        {images.map((src, i) => {
          const description = getDescription(src);

          return (
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

              {/* GALLERY HOVER OVERLAY (UPDATED) */}
              {!isComic && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                   {/* If there is a description, show it. Otherwise show nothing. */}
                   {description ? (
                      <p className="text-sm font-medium text-white leading-tight">
                        {description}
                      </p>
                   ) : (
                      // Optional: Show brand name if no description exists
                      <p className="text-xs font-mono text-cyan-500/50">REXTOON</p>
                   )}
                </div>
              )}
            </div>
          );
        })}
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
