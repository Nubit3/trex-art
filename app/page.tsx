import fs from "fs";
import path from "path";
import { Metadata } from "next";
import ArtSection from "./components/ArtSection";
import RexyChatbot from "./components/RexyChatbot";
import Navbar from "./components/Navbar";
import DrawSection from "./components/DrawSection";
import GameTerminal from "./components/GameTerminal";

// --- SEO METADATA (FULL LIST CONFIRMED) ---
export const metadata: Metadata = {
  title: "Rextoon - Free 2D Dino Game & Web3 Comics",
  description:
    "Play the Rextoon infinite runner game directly in your browser. Explore daily Web3 comics and digital art featuring the Green Trex Mascot.",
  // ADDED: Browser Tab Logo Configuration
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    // Brand & Art
    "Rextoon", "Web3 Comics", "Trex Mascot", "NFT Art", "Digital Artifacts",
    // Game Specifics
    "Dino Game", "Chrome Dino Game", "Trex Game", "Rex Game",
    // Broad Categories
    "2D Game", "Game", "Mobile Game", "Retro Arcade", "Indie Game",
    // Feature Specifics
    "Browser Game", "Infinite Runner", "No Download Game"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Rextoon - Play the 2D Dino Game",
    description: "The best browser-based Trex game and Web3 art gallery.",
    type: "website",
    locale: "en_US",
    siteName: "Rextoon",
    images: [
        {
          url: "/favicon.png", // Using Logo for OG Image fallback if needed
          width: 512,
          height: 512,
          alt: "Rextoon Logo",
        },
    ],
  },
};

// --- HELPERS ---
function getGalleryImages() {
  const artDir = path.join(process.cwd(), "public", "art");
  if (!fs.existsSync(artDir)) return [];
  return fs.readdirSync(artDir)
    .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file))
    .map((file) => `/art/${file}`);
}

function getComicsImages() {
  const comicsDir = path.join(process.cwd(), "public", "comics");
  if (!fs.existsSync(comicsDir)) return [];
  return fs.readdirSync(comicsDir)
    .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file))
    .map((file) => `/comics/${file}`);
}

export default function Home() {
  const galleryImages = getGalleryImages();
  const comicsImages = getComicsImages();

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Rextoon Dino Game",
    "genre": ["Arcade", "2D Game", "Infinite Runner", "Mobile Game"],
    "playMode": "SinglePlayer",
    "description": "A free 2D Trex game inspired by the classic Chrome Dino Game.",
    "operatingSystem": "Browser, Android, iOS",
    "character": "Green Trex Mascot",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-emerald-500/30 relative">

      {/* CRT SCANLINE OVERLAY */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      <div className="fixed inset-0 z-[0] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat pointer-events-none"></div>

      {/* GOOGLE SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAVBAR */}
      <Navbar />

      {/* HERO + GAME SECTION */}
      <section className="relative pt-32 pb-10 px-6 z-10">

        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center mb-20">

          {/* TEXT SIDE */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* UPDATED: H1 with Logo Image integrated nicely */}
            {/* UPDATED: Changed md:items-end to md:items-center for better vertical centering */}
            <h1 className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <img
                src="/favicon.png"
                alt="Rextoon Logo"
                // UPDATED: Resized to w-16/w-24 for better proportions
                className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
              <span>
                REX<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TOON</span>
              </span>
            </h1>

            <p className="text-slate-400 text-xl max-w-lg leading-relaxed font-light border-l-2 border-emerald-500 pl-6 text-center md:text-left">
              Play the <strong>Trex Game</strong>. Collect the <strong>Art</strong>. <br />
              <span className="text-emerald-400 font-mono text-sm uppercase tracking-widest mt-2 block">System Online • Web3 Ready</span>
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <a href="#game-terminal" className="group relative px-8 py-4 bg-white text-black font-bold tracking-wide rounded hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)]">
                <span className="relative z-10">PLAY NOW_</span>
              </a>
              <a href="#gallery" className="px-8 py-4 border border-white/20 text-white font-bold tracking-wide rounded hover:bg-white/10 transition-colors">
                VIEW GALLERY
              </a>
            </div>
          </div>

          {/* IMAGE SIDE */}
          <div className="relative order-1 lg:order-2 group">
            <div className="relative rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl w-full max-w-[600px] mx-auto lg:mx-0 bg-black transform group-hover:scale-[1.02] transition-transform duration-500">
               <img
                 src="/rextoon-header.jpg"
                 alt="Rextoon Gameplay and Art"
                 className="w-full h-auto object-cover block opacity-90 group-hover:opacity-100 transition-opacity"
                 width={600}
                 height={400}
                 fetchPriority="high"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>

        {/* GAME TERMINAL */}
        <div id="game-terminal" className="max-w-7xl mx-auto relative z-20 mt-12">
           <div className="text-center mb-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               LIVE TERMINAL
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
               ARCADE <span className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">TERMINAL</span>
             </h2>
           </div>

           <div className="relative max-w-5xl mx-auto">
               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 animate-pulse"></div>
               <div className="relative h-[600px] md:h-[700px] shadow-2xl rounded-xl overflow-hidden bg-black border border-white/10">
                   <GameTerminal />
               </div>
           </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
        <ArtSection
          id="gallery"
          title="ARTIFACTS_LOG"
          images={galleryImages}
          enableRating={false}
        />

        <ArtSection
          id="comics"
          title="NARRATIVE_DATABASE"
          images={comicsImages}
          variant="comics"
        />

        <DrawSection />
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            {/* UPDATED: Footer Brand with Logo integrated */}
            <h4 className="flex items-center gap-3 text-3xl font-bold text-white mb-6 tracking-tighter">
                <img
                  src="/favicon.png"
                  alt="Rextoon Logo"
                  className="w-10 h-10 object-contain"
                />
                <span>REXTOON<span className="text-emerald-500">.XYZ</span></span>
            </h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-mono">
              // EST. 2025 <br/>
              // PREHISTORIC ERA x BLOCKCHAIN<br/>
              // ALL SYSTEMS NOMINAL
            </p>
          </div>
          <div className="flex gap-8 md:justify-end items-center">
             <a href="https://x.com/trex_btc" className="text-slate-400 hover:text-white transition text-sm font-bold tracking-widest uppercase hover:underline decoration-emerald-500 underline-offset-4">Twitter</a>
             <a href="https://t.me/trex_btc" className="text-slate-400 hover:text-white transition text-sm font-bold tracking-widest uppercase hover:underline decoration-emerald-500 underline-offset-4">Telegram</a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
         <RexyChatbot />
      </div>

    </main>
  );
}
