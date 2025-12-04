
"use client";

import { useState, useEffect } from "react";

type NavbarProps = {
  brandClassName?: string;
};

const LINKS = [
  { href: "#gallery", label: "Gallery" },
  { href: "#comics", label: "Comics" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ brandClassName }: NavbarProps) {
  const [open, setOpen] = useState(false);

  // stop body scroll when sidebar open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  return (
    <>
      {/* Top bar with hamburger on left + brand on right */}
      <header className="flex items-center justify-between mb-10 md:mb-12">
        {/* HAMBURGER LEFT */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle navigation"
          className="relative z-50 w-10 h-10 rounded-full border border-emerald-500/70 bg-slate-950/80 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.7)] hover:border-lime-300 hover:shadow-[0_0_30px_rgba(190,242,100,0.9)] transition-all"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 rounded-full bg-emerald-200 transition-transform ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-full bg-emerald-200 transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-emerald-200 transition-transform ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* BRAND RIGHT */}
        <div className="flex flex-col leading-tight text-right">
          <span
            className={`${brandClassName ?? ""} text-xs md:text-sm uppercase tracking-[0.35em] text-lime-300/90`}
          >
            REXTOON
          </span>
          <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-cyan-300/80">
            Where a Dino Becomes a Web3 Legend.
          </span>
        </div>
      </header>

      {/* Backdrop when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-black/30"
          onClick={close}
        />
      )}

      {/* Left slide-out sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-slate-950/95 border-r border-emerald-700/80 shadow-[0_0_40px_rgba(16,185,129,0.7)] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col px-4 pt-6 pb-4">
          {/* small logo inside sidebar */}
          <div className="mb-8">
            <div className="flex flex-col leading-tight">
              <span
                className={`${brandClassName ?? ""} text-xs uppercase tracking-[0.35em] text-lime-300/90`}
              >
                REXTOON
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-cyan-300/80">
                Navigation
              </span>
            </div>
          </div>

          {/* nav links */}
          <nav className="flex-1 space-y-3 text-emerald-50 text-sm md:text-base">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="block px-2 py-2 rounded-xl hover:bg-emerald-900/60 hover:text-lime-300 border border-transparent hover:border-lime-400/80 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 text-[0.7rem] text-emerald-300/80">
            Tap a section to jump there · Built inside the REXTOON universe 🦖
          </div>
        </div>
      </aside>
    </>
  );
}
