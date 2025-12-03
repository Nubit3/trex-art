"use client";

import Image from "next/image";
import { Baloo_2 } from "next/font/google";
import { useState, useEffect } from "react";
import ImageModal from "./components/ImageModal";

import {
  Twitter,
  Send,
  MessageCircle,
  Mail,
} from "lucide-react";

// Cartoon heading font
const baloo = Baloo_2({ subsets: ["latin"] });

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Load images from API
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((imgs) => setGalleryImages(imgs));
  }, []);

  const featuredImage =
    galleryImages[galleryImages.length - 1] || "/art/featured.jpg";

  return (
    <main className="rex-bg min-h-screen text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* NAVBAR */}
        <header className="flex items-center justify-between mb-10 md:mb-12">
          <div className="flex flex-col leading-tight">
            <span
              className={`${baloo.className} text-xs md:text-sm uppercase tracking-[0.35em] text-lime-300/90`}
            >
              REXTOON
            </span>
            <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-cyan-300/80">
              Where a Dino Becomes a Web3 Legend.
            </span>
          </div>

          <nav className="flex gap-5 md:gap-6 text-xs md:text-sm text-cyan-100/80">
            <a href="#gallery" className="hover:text-lime-200 transition-colors">
              Gallery
            </a>
            <a href="#about" className="hover:text-lime-200 transition-colors">
              About
            </a>
            <a href="#connect" className="hover:text-lime-200 transition-colors">
              Connect
            </a>
            <a href="#contact" className="hover:text-lime-200 transition-colors">
              Contact
            </a>
          </nav>
        </header>

        {/* HERO SECTION */}
        <section className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center mb-16 md:mb-20">
          {/* TEXT SIDE */}
          <div className="space-y-5">
            <p className="pill inline-flex items-center text-[0.65rem] md:text-xs uppercase tracking-[0.35em] text-cyan-50/90 px-4 py-1.5">
              WEB3 CARTOONIST · HANDMADE ART
            </p>

            <div>
              <h1
                className={`${baloo.className} text-4xl md:text-6xl font-black leading-[1.02]`}
              >
                <span className="rex-gradient-text block drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
                  T&nbsp;REX
                </span>
              </h1>
              <p className="mt-2 text-lg md:text-2xl font-semibold text-emerald-50/95">
                the cartoon dino of Web3.
              </p>
            </div>

            <p className="text-emerald-100/85 text-sm md:text-base max-w-md">
              I&apos;m a Web3 cartoonist drawing a tiny T-Rex in different moods,
              stories and crypto moments. All pieces start as handmade sketches,
              then I scan and bring them to life digitally.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#gallery"
                className="px-5 py-3 rounded-2xl bg-lime-300 text-slate-900 font-semibold text-xs md:text-sm shadow-[0_0_40px_rgba(190,242,100,0.65)] hover:bg-lime-200 transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(190,242,100,0.85)]"
              >
                Explore Gallery
              </a>

              <a
                href="#featured"
                className="px-5 py-3 rounded-2xl border border-cyan-400/80 bg-slate-950/50 text-xs md:text-sm text-cyan-100/90 hover:border-fuchsia-400 hover:text-fuchsia-200 transition-colors"
              >
                View Featured Art
              </a>
            </div>

            <div className="flex flex-wrap gap-2 text-[0.68rem] md:text-[0.72rem] text-emerald-100/80">
              <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/60">
                ✏️ Handmade sketches
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-900/60 border border-sky-500/60">
                🌐 Web3 culture & memes
              </span>
              <span className="px-3 py-1 rounded-full bg-fuchsia-900/50 border border-fuchsia-500/70">
                🎨 Future NFT collections
              </span>
            </div>
          </div>

          {/* FEATURED ART */}
          <div id="featured" className="glow-card">
            <div className="rounded-3xl bg-slate-950/70 border border-emerald-700/80 shadow-[0_0_40px_rgba(16,185,129,0.65)] p-4 md:p-5 backdrop-blur-xl">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-sky-900 to-fuchsia-900">
                <Image
                  src={featuredImage}
                  alt="Featured REXTOON artwork"
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ART GALLERY */}
        <section id="gallery" className="mb-20">
          <h3 className={`${baloo.className} text-xl text-emerald-50 mb-4`}>
            Art Gallery
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((src, i) => (
              <div
                key={src + i}
                onClick={() => setSelectedIndex(i)}
                className="group relative rounded-2xl overflow-hidden border border-emerald-700/50 bg-slate-950/70 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] transition-all cursor-pointer"
              >
                <div className="relative w-full h-40 md:h-52">
                  <Image
                    src={src}
                    alt={`Artwork ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONNECT WITH ME */}
        <section id="connect" className="mb-20">
          <h3 className={`${baloo.className} text-xl text-emerald-50 mb-4`}>
            Connect With Me
          </h3>

          <div className="flex flex-col gap-4 text-cyan-200 text-lg">
            <a
              href="https://x.com/trex_btc"
              target="_blank"
              className="flex items-center gap-3 hover:text-lime-300 transition"
            >
              <Twitter /> @trex_btc
            </a>

            <a
              href="https://t.me/trex_btc"
              target="_blank"
              className="flex items-center gap-3 hover:text-lime-300 transition"
            >
              <Send /> Telegram: @trex_btc
            </a>

            <a
              href="https://discord.com/users/1041937099496103956"
              target="_blank"
              className="flex items-center gap-3 hover:text-lime-300 transition"
            >
              <MessageCircle /> Discord
            </a>

            <a
              href="mailto:trex.btc.eth@gmail.com"
              className="flex items-center gap-3 hover:text-lime-300 transition"
            >
              <Mail /> trex.btc.rth@gmail.com
            </a>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mb-14">
          <h3 className={`${baloo.className} text-lg md:text-xl mb-3 text-emerald-50`}>
            About REXTOON
          </h3>
          <p className="text-emerald-100/85 text-sm md:text-base max-w-2xl leading-relaxed">
            REXTOON is my cartoon universe about a tiny T-Rex trying to become a Web3 legend.
            I mix handmade sketchbook drawings with digital colour and storytelling.
            This website is the home for my artwork, experiments, and future NFT drops.
          </p>
        </section>

        {/* FOOTER */}
        <section
          id="contact"
          className="border-t border-emerald-800/70 pt-6 pb-2 text-[0.8rem] text-emerald-200/85 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <p>Reach me on socials:</p>

          <div className="flex gap-5 text-lg text-cyan-200">
            <a href="https://x.com/trex_btc" target="_blank">
              <Twitter className="hover:text-lime-300 transition" />
            </a>
            <a href="https://t.me/trex_btc" target="_blank">
              <Send className="hover:text-lime-300 transition" />
            </a>
            <a
              href="https://discord.com/users/1041937099496103956"
              target="_blank"
            >
              <MessageCircle className="hover:text-lime-300 transition" />
            </a>
            <a href="mailto:trex.btc.rth@gmail.com">
              <Mail className="hover:text-lime-300 transition" />
            </a>
          </div>
        </section>
      </div>

      {/* FULLSCREEN MODAL */}
      {selectedIndex !== null && galleryImages.length > 0 && (
        <ImageModal
          images={galleryImages}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onIndexChange={(newIndex) => setSelectedIndex(newIndex)}
        />
      )}
    </main>
  );
}
