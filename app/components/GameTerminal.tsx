"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// --- GAME DATA ---
const GAMES = [
  {
    id: "rexy-runner",
    title: "REXY RUNNER",
    description: "The original prehistoric infinite runner. Dodge Elon, collect $REX, and survive the bear market.",
    thumbnail: "/rexy-runner-poster.jpg",
    video: "/rexy-preview.mp4",
    url: "/rexy-runner-game.html",
    orientation: "landscape",
  },
  {
    id: "rexy-pong",
    title: "REXY PONG",
    description: "Classic DeFi Defense. Deflect the bear market meteors and farm $REX tokens in the middle zone.",
    thumbnail: "/rexy-pong-poster.jpg",
    video: "/rexy-pong-preview.mp4",
    url: "/rexy-pong.html",
    orientation: "landscape",
  },
  {
    id: "rexy-invaders",
    title: "REXY INVADERS",
    description: "Bear Market Attack! Blast through the FUD fleet, defeat the Elon Mothership, and catch falling tokens.",
    thumbnail: "/rexy-invaders-poster.jpg",
    video: "/rexy-invaders-preview.mp4",
    url: "/rexy-invaders.html",
    orientation: "portrait",
  },
];

export default function GameTerminal() {
  const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showRotatePrompt, setShowRotatePrompt] = useState(false);
  
  // New State for Scrolling
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Mount Check & Mobile Detection
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Scroll Lock when Playing
  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isPlaying]);

  // 3. Orientation Logic
  useEffect(() => {
    if (!isPlaying || !isMobile || !selectedGame) {
      setShowRotatePrompt(false);
      return;
    }

    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      if (selectedGame.orientation === "landscape" && isPortrait) {
        setShowRotatePrompt(true);
      } else if (selectedGame.orientation === "portrait" && !isPortrait) {
        setShowRotatePrompt(true);
      } else {
        setShowRotatePrompt(false);
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, [isPlaying, isMobile, selectedGame]);

  // 4. Auto-Scroll Logic (The Loop)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isAutoScrolling) return;

    let animationFrameId: number;

    const scroll = () => {
      if (scrollContainer) {
        // Move 1 pixel to the right
        scrollContainer.scrollLeft += 1;

        // Infinite Loop Logic:
        // If we have scrolled past the first set of games (halfway), snap back to 0
        // We use scrollWidth / 2 because we duplicated the list below
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
           scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoScrolling]);

  const launchGame = () => {
    setIsPlaying(true);
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => console.log("Fullscreen blocked:", err));
    }
  };

  const exitGame = () => {
    setIsPlaying(false);
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-[#0a0a0a] rounded-xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col">

      {/* --- MENU VIEW --- */}
      {!isPlaying && (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-6">

            {/* 1. LIVE PREVIEWS SECTION */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                    <h3 className="text-xs font-mono text-red-500 tracking-widest uppercase">Live Feeds</h3>
                </div>

                {/* Horizontal Scroll Container */}
                <div 
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
                  // Pause auto-scroll on interaction
                  onMouseEnter={() => setIsAutoScrolling(false)}
                  onMouseLeave={() => setIsAutoScrolling(true)}
                  onTouchStart={() => setIsAutoScrolling(false)}
                  onTouchEnd={() => setIsAutoScrolling(true)}
                >
                    {/* We duplicate the array [...GAMES, ...GAMES] to create the seamless loop buffer */}
                    {[...GAMES, ...GAMES].map((game, index) => (
                        <div 
                          key={`${game.id}-${index}`} 
                          onClick={() => setSelectedGame(game)} 
                          className="shrink-0 w-[280px] md:w-[400px] aspect-video rounded-lg border border-white/10 bg-black overflow-hidden relative cursor-pointer group hover:border-emerald-500/50 transition-all"
                        >
                            <video
                                src={game.video}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" // pointer-events-none disables the pause button/controls
                                autoPlay 
                                muted 
                                loop 
                                playsInline
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                                <span className="text-white font-bold text-sm">{game.title}</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 bg-emerald-500/90 rounded-full flex items-center justify-center text-black font-bold">▶</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. GAME GRID */}
            <div>
                <h3 className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-4">Available Cartridges</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {GAMES.map((game) => (
                    <div
                        key={game.id}
                        onClick={() => setSelectedGame(game)}
                        className="group relative aspect-square bg-slate-900 rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        <div className="absolute inset-0 bg-slate-800">
                        <img
                            src={game.thumbnail}
                            alt={game.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <h3 className="font-bold text-white text-sm md:text-base tracking-wide shadow-black drop-shadow-md">{game.title}</h3>
                        <p className="text-xs text-emerald-400 font-mono">PLAY NOW</p>
                        </div>
                    </div>
                    ))}
                    <div className="aspect-square bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center opacity-50 border-dashed">
                    <span className="text-2xl mb-2">🔒</span>
                    <span className="text-xs font-mono text-center px-2">MORE GAMES<br/>COMING SOON</span>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- DETAILS POPUP --- */}
      {selectedGame && !isPlaying && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

            <div className="w-full aspect-video bg-black relative border-b border-white/10">
                <video
                    src={selectedGame.video}
                    className="w-full h-full object-cover pointer-events-none" // Disable controls here too
                    autoPlay muted loop playsInline
                />
                <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition">✕</button>
            </div>

            <div className="p-6 md:p-8 text-center overflow-y-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedGame.title}</h2>
                <div className="w-16 h-1 bg-emerald-500 mx-auto mb-6 rounded-full"/>
                <p className="text-slate-400 mb-8 leading-relaxed text-sm md:text-base">{selectedGame.description}</p>
                <button onClick={launchGame} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg tracking-widest rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02]">
                START GAME ▶
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTIVE GAME (PORTAL) --- */}
      {mounted && isPlaying && selectedGame && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black w-screen h-screen overflow-hidden touch-none">
            {/* EXIT BUTTON */}
            <button
              onClick={exitGame}
              className="fixed top-6 right-6 z-[100000] bg-red-600/90 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 border-white/20 hover:bg-red-500 shadow-xl"
            >
              ✕
            </button>

            {/* ROTATION PROMPT OVERLAY */}
            {showRotatePrompt && (
               <div className="fixed inset-0 z-[100001] bg-black/95 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in">
                  <div className="text-6xl mb-6 animate-pulse">
                    {selectedGame.orientation === 'landscape' ? '⟲' : '📱'}
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-red-500">Please Rotate Device</h2>
                  <p className="text-slate-300 max-w-xs leading-relaxed">
                    <span className="text-emerald-400 font-bold">{selectedGame.title}</span> requires
                    <span className="font-bold underline ml-1">{selectedGame.orientation.toUpperCase()}</span> mode for the best experience.
                  </p>
               </div>
            )}

            {/* THE GAME IFRAME */}
            <iframe
              ref={iframeRef}
              src={selectedGame.url}
              title="Game Frame"
              className="w-full h-full border-0 block absolute inset-0 bg-black"
              allowFullScreen
            />
        </div>,
        document.body
      )}
    </div>
  );
}
