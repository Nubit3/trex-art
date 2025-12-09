"use client";
import { useState } from "react";

const FAQ = [
  { q: "PROJECT IDENTITY?", a: "REXTOON is a digital art narrative exploring Web3 culture through the lens of a T-Rex." },
  { q: "TOKENOMICS / NFT?", a: "Currently in experimental phase. Digital artifacts are created daily. Contract deployment pending." },
  { q: "CREATION PROCESS?", a: "Hybrid Analog/Digital workflow. Hand-sketched schematics digitised for the blockchain." },
];

export default function RexyChatbot() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    // FIXED: z-[9999] guarantees it sits on top of everything
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">

      {/* TERMINAL WINDOW */}
      {open && (
        <div className="mb-4 w-80 bg-[#050505] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] font-mono text-xs rounded-lg overflow-hidden">
          <div className="bg-emerald-950/30 p-2 border-b border-emerald-500/30 flex justify-between items-center">
            <span className="text-emerald-400">REXY.AI_ASSISTANT</span>
            <button onClick={() => setOpen(false)} className="text-red-400 hover:text-white px-2">[CLOSE]</button>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-emerald-600">
            <div className="text-slate-400">
              {">"} Initializing communication protocol...<br/>
              {">"} Online. How can I assist?
            </div>

            {activeIndex !== null && (
                <div className="space-y-2 animate-fadeIn">
                    <p className="text-white bg-white/5 p-2 border-l-2 border-white">{FAQ[activeIndex].q}</p>
                    <p className="text-emerald-300">{">"} {FAQ[activeIndex].a}</p>
                </div>
            )}
          </div>

          <div className="p-2 border-t border-emerald-500/30 grid grid-cols-1 gap-1 bg-[#020617]">
            {FAQ.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className="text-left px-2 py-2 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 transition-colors truncate border border-transparent hover:border-emerald-500/20 rounded"
                >
                    {idx + 1}. {item.q}
                </button>
            ))}
          </div>
        </div>
      )}

      {/* LAUNCH BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all hover:scale-110 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>
    </div>
  );
}
