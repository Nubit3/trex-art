"use client";

import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

type ArtSectionProps = {
  id: string;
  title: string;
  images: string[];
  headingClassName?: string;
  enableRating?: boolean;
};

export default function ArtSection({
  id,
  title,
  images,
  headingClassName,
  enableRating = false,
}: ArtSectionProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  const openModal = (index: number) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);

  const handleRating = (image: string, value: number) => {
    setRatings((prev) => ({ ...prev, [image]: value }));
  };

  return (
    <section id={id} className="mb-20">
      <h3
        className={`${headingClassName} text-xl text-emerald-50 mb-4 tracking-wide`}
      >
        {title}
      </h3>

      {/* MOBILE FIX → grid-cols-1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <div
            key={src + i}
            className="group relative rounded-2xl overflow-hidden border border-emerald-700/50 bg-slate-950/70 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            onClick={() => openModal(i)}
          >
            <div className="relative w-full h-52">
              <Image
                src={src}
                alt={`Artwork ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Rating (optional) */}
            {enableRating && (
              <div className="flex items-center justify-between p-2 text-xs text-emerald-200">
                <span>Rate:</span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, num) => (
                    <button
                      key={num}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(src, num + 1);
                      }}
                      className={`w-5 h-5 text-[0.65rem] rounded-full border ${
                        ratings[src] === num + 1
                          ? "bg-lime-300 text-slate-900 border-lime-400"
                          : "border-emerald-600 text-emerald-300"
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalIndex !== null && (
        <ImageModal
          images={images}
          currentIndex={modalIndex}
          onClose={closeModal}
          onNext={() =>
            setModalIndex((prev) =>
              prev === null ? null : (prev + 1) % images.length
            )
          }
          onPrev={() =>
            setModalIndex((prev) =>
              prev === null
                ? null
                : (prev - 1 + images.length) % images.length
            )
          }
        />
      )}
    </section>
  );
}
