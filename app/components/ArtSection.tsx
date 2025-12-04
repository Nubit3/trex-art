"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";

type ArtSectionProps = {
  id: string;
  title: string;
  images: string[];
  enableRating?: boolean;
  headingClassName?: string;
};

type RatingsState = { [src: string]: number };

const FUNNY_LABELS: string[] = [
  "0/10 – extinction level 🤯",
  "1/10 – still in the egg 🥚",
  "2/10 – baby dino is shy 🐣",
  "3/10 – needs more teeth 🦷",
  "4/10 – almost roaring 🐊",
  "5/10 – mid dino energy 😶",
  "6/10 – rexpecting greatness 🧪",
  "7/10 – pretty rawr-some 😏",
  "8/10 – giga chad dino 💪",
  "9/10 – Web3 museum piece 🖼️",
  "10/10 – LEGENDARY T-REX 🔥",
];

function getFunnyLabel(score: number) {
  if (score < 0 || score > 10) return "Rate it on the Rex-o-Meter!";
  return FUNNY_LABELS[score];
}

export default function ArtSection({
  id,
  title,
  images,
  enableRating = false,
  headingClassName,
}: ArtSectionProps) {
  const [ratings, setRatings] = useState<RatingsState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Load ratings from localStorage
  useEffect(() => {
    if (!enableRating) return;
    try {
      const stored = window.localStorage.getItem("rex-ratings");
      if (stored) {
        setRatings(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [enableRating]);

  // Save ratings to localStorage
  useEffect(() => {
    if (!enableRating) return;
    try {
      window.localStorage.setItem("rex-ratings", JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }, [ratings, enableRating]);

  const handleRate = (src: string, value: number) => {
    setRatings((prev) => ({ ...prev, [src]: value }));
  };

  const openModal = (index: number) => {
    if (!images || images.length === 0) return;
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const showNext = () => {
    if (!images || images.length === 0) return;
    setModalIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = () => {
    if (!images || images.length === 0) return;
    setModalIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id={id} className="mb-20">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h3
          className={`${headingClassName ?? ""} text-xl md:text-2xl text-emerald-50 flex items-center gap-2`}
        >
          {title}
          {enableRating && (
            <span className="text-[0.65rem] px-2 py-1 rounded-full bg-lime-300/15 border border-lime-300/70 text-lime-200 uppercase tracking-[0.15em]">
              Rex-o-Meter 0–10
            </span>
          )}
        </h3>
        {enableRating && (
          <p className="text-[0.7rem] md:text-xs text-emerald-200/80">
            Tap a number to rate each piece. Be honest… Rex is watching 👀
          </p>
        )}
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-emerald-200/80">
          No {title.toLowerCase()} yet. T-Rex is sharpening his pencils… ✏️
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, i) => {
            const rating = ratings[src] ?? 0;

            return (
              <div
                key={src + i}
                className="group relative rounded-2xl overflow-hidden border border-emerald-700/50 bg-slate-950/70 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] transition-all"
              >
                {/* Clickable image area opens modal */}
                <button
                  type="button"
                  onClick={() => openModal(i)}
                  className="relative w-full h-40 md:h-52 block"
                >
                  <Image
                    src={src}
                    alt={`${title} artwork ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="pointer-events-none absolute bottom-1.5 right-1.5 text-[0.6rem] px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-100/90 border border-emerald-500/70">
                    Tap to zoom 🔍
                  </span>
                </button>

                {enableRating && (
                  <div className="border-t border-emerald-800/70 px-3 py-2 text-[0.7rem] bg-slate-950/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-emerald-50">
                        Rex-o-Meter
                      </span>
                      <span className="text-lime-300 font-semibold">
                        {rating}/10
                      </span>
                    </div>

                    <div className="mt-1 flex gap-1 overflow-x-auto pb-1">
                      {Array.from({ length: 11 }).map((_, n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleRate(src, n)}
                          className={`px-2 py-1 rounded-full border text-[0.65rem] whitespace-nowrap transition-all ${
                            n === rating
                              ? "bg-lime-300 text-slate-900 border-lime-300 shadow-[0_0_20px_rgba(190,242,100,0.8)]"
                              : "bg-slate-900/70 border-emerald-700/70 text-emerald-100/85 hover:bg-emerald-800/70"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    <p className="mt-1 text-[0.65rem] text-emerald-200/80">
                      {getFunnyLabel(rating)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN MODAL FOR BOTH ART & COMICS */}
      {isModalOpen && images.length > 0 && (
        <ImageModal
          images={images}
          currentIndex={modalIndex}
          onClose={closeModal}
          onNext={showNext}
          onPrev={showPrev}
        />
      )}
    </section>
  );
}
