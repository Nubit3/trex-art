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
    thumbnail: "/rexy-pong-poster.jpg", // Placeholder until you add the new poster
    video: "/rexy-preview.mp4", // Placeholder until you add the new video
    url: "/rexy-pong.html",
    orientation: "landscape",
  },
  // --- NEW GAME ADDED HERE ---
  {
    id: "rexy-invaders",
    title: "REXY INVADERS",
    description: "Bear Market Attack! Blast through the FUD fleet, defeat the Elon Mothership, and catch falling tokens.",
    thumbnail: "/rexy-invaders-poster.jpg", // Placeholder
    video: "/rexy-preview.mp4", // Placeholder
    url: "/rexy-invaders.html",
    orientation: "landscape",
  },
];

export default function GameTerminal() {
  const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Mount Check
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Scroll Lock
  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isPlaying]);

  const launchGame = () => {
    setIsPlaying(true);
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
  };

  const exitGame = () => {
    setIsPlaying(false);
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
  };

  // 3. Orientation Logic
  const [needsRotation, setNeedsRotation] = useState(false);
  useEffect(() => {
    if (!isPlaying || !isMobile) {
      setNeedsRotation(false);
      return;
    }
    const checkOrientation = () => {
      setNeedsRotation(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, [isPlaying, isMobile]);

  return (
    <div className="w-full h-full min-h-[600px] bg-[#0a0a0a] rounded-xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col">

      {/* --- MENU VIEW --- */}
      {!isPlaying && (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-6">

            {/* 1. LIVE PREVIEWS SECTION (Top of Terminal) */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                    <h3 className="text-xs font-mono text-red-500 tracking-widest uppercase">Live Feeds</h3>
                </div>

                {/* Horizontal Scroll Container for Previews */}
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {GAMES.map((game) => (
                        <div key={game.id} onClick={() => setSelectedGame(game)} className="snap-center shrink-0 w-[280px] md:w-[400px] aspect-video rounded-lg border border-white/10 bg-black overflow-hidden relative cursor-pointer group hover:border-emerald-500/50 transition-all">
                            {/* Video Autoplays nicely here */}
                            <video
                                src={game.video}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                autoPlay muted loop playsInline
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                                <span className="text-white font-bold text-sm">{game.title}</span>
                            </div>
                            {/* Play Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 bg-emerald-500/90 rounded-full flex items-center justify-center text-black font-bold">▶</div>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for "Coming Soon" Feed */}
                    <div className="snap-center shrink-0 w-[280px] md:w-[400px] aspect-video rounded-lg border border-white/5 bg-white/5 flex flex-col items-center justify-center">
                        <span className="text-4xl opacity-20">📡</span>
                        <span className="text-xs font-mono text-slate-600 mt-2">OFFLINE SIGNAL</span>
                    </div>
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

      {/* --- DETAILS POPUP (With Video Header) --- */}
      {selectedGame && !isPlaying && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

            {/* Video Header in Popup */}
            <div className="w-full aspect-video bg-black relative border-b border-white/10">
                <video
                    src={selectedGame.video}
                    className="w-full h-full object-cover"
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
            <button
              onClick={exitGame}
              className="fixed top-6 right-6 z-[100000] bg-red-600/90 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 border-white/20 hover:bg-red-500 shadow-xl"
            >
              ✕
            </button>

            {needsRotation && (
               <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100001] opacity-0 animate-pulse">
                  <p className="text-white bg-black/50 p-2 rounded">Rotate Device</p>
               </div>
            )}

            <iframe
              ref={iframeRef}
              src={selectedGame.url}
              title="Game Frame"
              className="block border-0 absolute"
              style={{
                width: needsRotation ? "100vh" : "100vw",
                height: needsRotation ? "100vw" : "100vh",
                transform: needsRotation ? "rotate(90deg)" : "none",
                transformOrigin: "center center",
                left: "50%",
                top: "50%",
                marginLeft: needsRotation ? "-50vh" : "-50vw",
                marginTop: needsRotation ? "-50vw" : "-50vh",
              }}
              allowFullScreen
            />
        </div>,
        document.body
      )}
    </div>
  );
}
