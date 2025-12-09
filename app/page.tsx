import fs from "fs";
import path from "path";
import ArtSection from "./components/ArtSection";
import RexyChatbot from "./components/RexyChatbot";
import Navbar from "./components/Navbar";
import DrawSection from "./components/DrawSection";

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

  return (
    <main className="min-h-screen dino-skin-bg text-white overflow-x-hidden font-sans selection:bg-emerald-500/30">
      
      {/* NAVBAR (Includes Hamburger) */}
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              System Online
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              REX<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TOON</span>
            </h1>

            <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-light">
              Digital Artifacts. Blockchain Narrative. <br />
              <span className="text-emerald-500 font-medium">The Apex Predator of Web3 Art.</span>
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#gallery" className="px-8 py-4 bg-white text-black font-bold tracking-wide rounded hover:bg-emerald-400 transition-colors">
                ENTER ARCHIVE
              </a>
              <a href="#game" className="px-8 py-4 border border-white/20 text-white font-bold tracking-wide rounded hover:bg-white/5 transition-colors">
                PLAY GAME
              </a>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl w-full max-w-[600px] mx-auto lg:mx-0 bg-black">
               <img 
                 src="/rextoon-header.jpg" 
                 alt="Hero Art"
                 className="w-full h-auto object-cover block"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-40">
        <ArtSection
          id="gallery"
          title="DIGITAL ARTIFACTS"
          images={galleryImages}
          enableRating={false} 
        />
        
        {/* COMICS (Now uses Grid layout via updated ArtSection) */}
        <ArtSection
          id="comics"
          title="NARRATIVE LOGS"
          images={comicsImages}
          variant="comics" 
        />

        <DrawSection />
      </div>

      {/* GAME SECTION */}
      <section id="game" className="w-full py-24 relative overflow-hidden mt-12">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              ARCADE <span className="text-emerald-500">TERMINAL</span>
            </h2>
            <p className="text-slate-500 font-mono text-sm">TRY TO BEAT THE HIGH SCORE</p>
          </div>

          <div className="rounded-3xl bg-[#0a0a0a] p-4 md:p-8 border border-white/5 shadow-2xl relative">
             <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-slate-800" />
             <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-800" />
             <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-slate-800" />
             <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-slate-800" />

             <div className="console-frame rounded-xl overflow-hidden bg-black relative">
                <div className="w-full h-[60vh] md:h-[70vh]">
                  <iframe
                    src="/rexy-runner-game.html"
                    className="w-full h-full border-0 block"
                    title="Rexy Runner Game"
                    loading="lazy" 
                  />
                </div>
             </div>

             <div className="mt-6 flex justify-between items-center px-4">
                <div className="flex gap-2">
                   <div className="w-8 h-1 bg-emerald-900 rounded-full"></div>
                   <div className="w-8 h-1 bg-emerald-900 rounded-full"></div>
                </div>
                <div className="font-mono text-emerald-700 text-xs tracking-widest">
                   INSERT COIN
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-2xl font-bold text-white mb-4">REXTOON STUDIOS</h4>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Forged in the prehistoric era, minted on the blockchain.
            </p>
          </div>
          <div className="flex gap-8 md:justify-end items-center">
             <a href="https://x.com/trex_btc" className="text-slate-400 hover:text-white transition text-sm font-bold tracking-widest uppercase">Twitter</a>
             <a href="https://t.me/trex_btc" className="text-slate-400 hover:text-white transition text-sm font-bold tracking-widest uppercase">Telegram</a>
             <a href="mailto:trex.btc.eth@gmail.com" className="text-slate-400 hover:text-white transition text-sm font-bold tracking-widest uppercase">Email</a>
          </div>
        </div>
      </footer>

      {/* FORCE CHATBOT VISIBILITY */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
         <RexyChatbot />
      </div>

    </main>
  );
}
