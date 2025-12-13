"use client";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* 1. HAMBURGER BUTTON (LEFT) */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-white hover:text-emerald-400 transition-colors"
          >
            {/* The 3 Dashes Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* 2. LOGO (RIGHT/CENTER) - UPDATED WITH FAVICON */}
          <div className="flex items-center gap-3">
            <img 
              src="/favicon.png" 
              alt="Rextoon Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
            />
            <div className="text-2xl font-bold tracking-tighter text-white">
              REX<span className="text-emerald-500">TOON</span>
            </div>
          </div>

        </div>
      </nav>

      {/* SIDEBAR SLIDER (LEFT SIDE) */}

      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 z-[101] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* The Actual Sidebar (Slides from LEFT) */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-[#0a0a0a] border-r border-emerald-500/20 z-[102] transform transition-transform duration-300 shadow-2xl p-8 flex flex-col gap-8 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col gap-6 mt-8">
          <a href="#" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">HOME</a>
          <a href="#gallery" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">GALLERY</a>
          <a href="#comics" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">COMICS</a>
          <a href="#game" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">GAME</a>
        </div>

        {/* Decor */}
        <div className="mt-auto border-t border-white/10 pt-8">
          <p className="text-xs text-emerald-500 font-mono tracking-widest uppercase">
            SYSTEM STATUS: ONLINE
          </p>
        </div>
      </div>
    </>
  );
}
