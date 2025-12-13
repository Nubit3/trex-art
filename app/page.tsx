import fs from "fs";
import path from "path";
import { Metadata } from "next";
import ArtSection from "./components/ArtSection";
import RexyChatbot from "./components/RexyChatbot";
import Navbar from "./components/Navbar";
import DrawSection from "./components/DrawSection";
import GameTerminal from "./components/GameTerminal";

export const metadata: Metadata = {
  title: "Rextoon - Free 2D Dino Game & Web3 Comics",
  description: "Play the Rextoon infinite runner game. Explore Web3 comics.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

// --- HELPERS ---
function getGalleryImages() {
  const artDir = path.join(process.cwd(), "public", "art");
  if (!fs.existsSync(artDir)) return [];
  return fs.readdirSync(artDir).filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file)).map((file) => `/art/${file}`);
}

function getComicsImages() {
  const comicsDir = path.join(process.cwd(), "public", "comics");
  if (!fs.existsSync(comicsDir)) return [];
  return fs.readdirSync(comicsDir).filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file)).map((file) => `/comics/${file}`);
}

export default function Home() {
  const galleryImages = getGalleryImages();
  const comicsImages = getComicsImages();

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-emerald-500/30 relative">

      {/* CRT SCANLINE OVERLAY */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      <div className="fixed inset-0 z-[0] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat pointer-events-none"></div>

      <Navbar />

      {/* HERO + GAME SECTION */}
      <section className="relative pt-32 pb-10 px-6 z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8 order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <div className="w-full flex flex-col items-center justify-center gap-6 mb-4">
              <img src="/favicon.png" alt="Rextoon Mascot" className="h-[120px] w-auto object-contain drop-shadow-[0_0_25px_rgba(74,222,128,0.4)]" />
              {/* FIXED: Removed font-bold */}
              <h1 className="font-silkscreen text-[60px] md:text-[80px] leading-none tracking-tight text-white drop-shadow-lg">
                REX<span className="text-[#4ADE80] drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">TOON</span>
              </h1>
            </div>

            <p className="text-slate-400 text-xl max-w-lg leading-relaxed font-light border-l-2 border-[#4ADE80] pl-6 text-center lg:text-left mx-auto lg:mx-0">
              Play the <strong>Trex Game</strong>. Collect the <strong>Art</strong>. <br />
              <span className="text-[#4ADE80] font-silkscreen text-xs uppercase tracking-widest mt-2 block opacity-80">
                System Online • Web3 Ready
              </span>
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start w-full">
              {/* FIXED: Removed font-bold */}
              <a href="#game-terminal" className="group relative px-8 py-4 bg-white text-black font-silkscreen text-lg tracking-wide rounded hover:bg-[#4ADE80] transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(74,222,128,0.6)]">
                <span className="relative z-10">PLAY NOW_</span>
              </a>
              {/* FIXED: Removed font-bold */}
              <a href="#gallery" className="px-8 py-4 border border-white/20 text-white font-silkscreen tracking-wide rounded hover:bg-white/10 transition-colors text-sm flex items-center">
                VIEW GALLERY
              </a>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 group">
            <div className="relative rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl w-full max-w-[600px] mx-auto lg:mx-0 bg-black transform group-hover:scale-[1.02] transition-transform duration-500">
               <img src="/rextoon-header.jpg" alt="Rextoon Gameplay" className="w-full h-auto object-cover block opacity-90 group-hover:opacity-100 transition-opacity" width={600} height={400} />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>

        {/* GAME TERMINAL */}
        <div id="game-terminal" className="max-w-7xl mx-auto relative z-20 mt-12">
           <div className="text-center mb-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#4ADE80] text-xs font-mono mb-4">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
               </span>
               LIVE TERMINAL
             </div>
             {/* FIXED: Removed font-bold, this fixes the 'M' looking like 'H' */}
             <h2 className="text-3xl md:text-5xl font-silkscreen text-white tracking-tight">
               ARCADE <span className="text-[#4ADE80] drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">TERMINAL</span>
             </h2>
           </div>

           <div className="relative max-w-5xl mx-auto">
               <div className="absolute -inset-1 bg-gradient-to-r from-[#4ADE80] to-cyan-500 rounded-2xl blur opacity-20 animate-pulse"></div>
               <div className="relative h-[600px] md:h-[700px] shadow-2xl rounded-xl overflow-hidden bg-black border border-white/10">
                   <GameTerminal />
               </div>
           </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
        <ArtSection id="gallery" title="ARTIFACTS_LOG" images={galleryImages} enableRating={false} />
        <ArtSection id="comics" title="NARRATIVE_DATABASE" images={comicsImages} variant="comics" />
        <DrawSection />
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            {/* FIXED: Removed font-bold */}
            <h4 className="flex items-center gap-3 text-3xl font-silkscreen text-white mb-6 tracking-tighter">
                <img src="/favicon.png" alt="Rextoon Logo" className="w-10 h-10 object-contain" />
                <span>REX<span className="text-[#4ADE80]">TOON</span>.XYZ</span>
            </h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-mono">
              // EST. 2025 <br/>
              // PREHISTORIC ERA x BLOCKCHAIN
            </p>
          </div>
          <div className="flex gap-8 md:justify-end items-center">
             <a href="https://x.com/trex_btc" className="text-slate-400 hover:text-white transition text-sm font-silkscreen tracking-widest uppercase hover:underline decoration-[#4ADE80] underline-offset-4">Twitter</a>
             <a href="https://t.me/trex_btc" className="text-slate-400 hover:text-white transition text-sm font-silkscreen tracking-widest uppercase hover:underline decoration-[#4ADE80] underline-offset-4">Telegram</a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
         <RexyChatbot />
      </div>
    </main>
  );
}
