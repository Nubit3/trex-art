"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "Who is T-Rex?",
    a: "T-Rex is my tiny cartoon dino who explores Web3, trades coins, and stars in all the art you see here.",
  },
  {
    q: "Are these NFTs yet?",
    a: "Not all of them… yet. I’m experimenting and will drop collections in the future. Watch my X for alpha: @trex_btc.",
  },
  {
    q: "Are the drawings handmade?",
    a: "Yes! Everything starts as a sketch in my notebook. Then I scan, colour and remix them digitally.",
  },
  {
    q: "Can I commission a custom T-Rex?",
    a: "Probably yes! DM me on X with your idea, budget and timeline and I’ll roar back.",
  },
  {
    q: "What is REXTOON?",
    a: "REXTOON is the whole cartoon universe where this dino lives – comics, memes, art, and eventually full Web3 lore.",
  },
];

export default function RexyChatbot() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? FAQ[activeIndex] : null;

  return (
    <div className="fixed bottom-16 right-4 md:bottom-10 md:right-10 z-40">
      {open && (
        <div className="mb-3 w-72 max-w-[80vw] rounded-3xl bg-slate-950/95 border border-emerald-700/80 shadow-[0_0_35px_rgba(56,189,248,0.85)] p-3 text-[0.75rem]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦖</span>
              <div>
                <div className="font-semibold text-emerald-50">Rexy</div>
                <div className="text-[0.65rem] text-cyan-300/85">
                  Tiny dino, big alpha.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-emerald-300/80 hover:text-emerald-100"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 mb-2 max-h-40 overflow-y-auto pr-1">
            {active ? (
              <>
                <div className="flex justify-end">
                  <div className="bg-emerald-900/70 rounded-2xl px-3 py-2 max-w-[85%] text-right text-emerald-50">
                    <div className="text-[0.65rem] text-emerald-200/85 mb-0.5">
                      You
                    </div>
                    <div>{active.q}</div>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-slate-900/85 rounded-2xl px-3 py-2 max-w-[90%] text-emerald-100">
                    <div className="text-[0.65rem] text-cyan-300/85 mb-0.5">
                      Rexy
                    </div>
                    <div>{active.a}</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[0.7rem] text-emerald-200/85">
                I&apos;m Rexy, your tiny chat dino. Pick a question below and I&apos;ll
                spill some Web3 art alpha 🦕
              </p>
            )}
          </div>

          <div>
            <div className="text-[0.65rem] text-emerald-200/80 mb-1">
              Quick questions:
            </div>
            <div className="flex flex-wrap gap-1">
              {FAQ.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="px-2 py-1 rounded-full bg-slate-900/80 border border-emerald-700/80 text-[0.65rem] text-emerald-100 hover:border-lime-300 hover:text-lime-200"
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bubble with glow + subtle motion */}
      <div className="relative flex justify-end">
        {/* pulsing glow behind the bubble */}
        {!open && (
          <div className="absolute inset-0 translate-y-1 rounded-full bg-lime-300/40 blur-md animate-pulse pointer-events-none" />
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative w-16 h-16 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-lime-300 via-emerald-400 to-cyan-400 shadow-[0_0_40px_rgba(190,242,100,0.9)] flex items-center justify-center text-3xl border border-emerald-700/80 hover:scale-110 active:scale-95 transition-transform duration-200 animate-bounce md:animate-none"
          aria-label="Open Rexy chat"
        >
          🦖
          {!open && (
            <span className="absolute -top-1 -left-2 px-2 py-0.5 rounded-full bg-slate-950/90 text-[0.6rem] text-lime-200 border border-lime-300/70 shadow-sm">
              ask me!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
