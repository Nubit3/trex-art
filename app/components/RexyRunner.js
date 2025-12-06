// app/components/RexyRunner.js
"use client";

import React from "react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({ subsets: ["latin"] });

export default function RexyRunner() {
  return (
    <div className="flex flex-col items-center p-6 bg-slate-900 rounded-xl shadow-2xl border border-sky-500/50">
      <h2
        className={`${baloo.className} text-4xl mb-4 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]`}
      >
        Rexy's Daily Mining Rush ⚡️
      </h2>
      <p className="mb-4 text-sm text-sky-200/80 max-w-lg text-center">
        Jump with **Spacebar** or **Tap** inside the arcade window to mine **REX Tokens**.
      </p>
      
      {/* 🚨 THE IFRAME: Embeds the standalone game file 🚨 */}
      <iframe
        src="/rexy-runner-game.html" // Points to the file in the public/ folder
        width="600"
        height="150"
        frameBorder="0"
        scrolling="no"
        title="Rexy Runner Arcade Game"
        className="w-full max-w-lg rounded-lg"
        style={{ height: '150px' }}
      ></iframe>
      
      <p className="mt-3 text-xs text-gray-500">
        (Using isolated logic for guaranteed functionality)
      </p>
    </div>
  );
}
