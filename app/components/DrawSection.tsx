"use client";

import React, { useEffect, useRef, useState } from "react";

// --- ICONS (Simple SVGs) ---
const Icons = {
  Pencil: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>,
  Eraser: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"></path><path d="M17 17L7 7"></path></svg>,
  Fill: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11l-8-8-9 9 8 8 5-5 9-9-5-5z"></path><path d="M22 22h-10"></path></svg>,
  Rect: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>,
  Circle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>,
  Undo: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Trash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
};

const palette = [
  "#000000", "#555555", "#aaaaaa", "#ffffff",
  "#ef4444", "#f97316", "#facc15", "#22c55e",
  "#3b82f6", "#6366f1", "#a855f7", "#ec4899",
];

const CANVAS_BG = "#ffffff";

// --- HELPERS ---
function hexToRGBA(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 255 };
}

function colorsMatch(data: Uint8ClampedArray, index: number, target: { r: number; g: number; b: number; a: number }) {
  return data[index] === target.r && data[index + 1] === target.g && data[index + 2] === target.b && data[index + 3] === target.a;
}

export default function DrawSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<"brush" | "eraser" | "line" | "rect" | "circle" | "fill">("brush");

  // Shapes & Logic
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const shapeSnapshot = useRef<ImageData | null>(null);

  // Init
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Responsive Canvas Sizing
    const initCanvas = () => {
       const { width, height } = container.getBoundingClientRect();
       canvas.width = width;
       canvas.height = height; // Full container height

       const ctx = canvas.getContext("2d", { willReadFrequently: true });
       if (!ctx) return;
       ctx.lineCap = "round";
       ctx.lineJoin = "round";
       ctx.imageSmoothingEnabled = false; // Pixel art feel
       ctxRef.current = ctx;

       // Fill White
       ctx.fillStyle = CANVAS_BG;
       ctx.fillRect(0, 0, canvas.width, canvas.height);

       // Save initial state for undo
       saveState();
    };

    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, []);

  // Update Context Props
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? CANVAS_BG : brushColor;
    ctx.fillStyle = tool === "eraser" ? CANVAS_BG : brushColor;
  }, [brushColor, brushSize, tool]);

  const saveState = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if(ctx && canvas) {
          if (historyRef.current.length > 9) historyRef.current.shift(); // Limit history
          historyRef.current.push(ctx.getImageData(0,0,canvas.width, canvas.height));
      }
  };

  const undo = () => {
      const ctx = ctxRef.current;
      if(ctx && historyRef.current.length > 0) {
          const prevState = historyRef.current.pop();
          if(prevState) ctx.putImageData(prevState, 0, 0);
      }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if(e.cancelable) e.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;
    const { x, y } = getPos(e);

    if (tool === "fill") {
      saveState();
      floodFill(x, y, brushColor);
      return;
    }

    saveState(); // Save before stroke
    setIsDrawing(true);

    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      setStartPoint({ x, y });
      shapeSnapshot.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if(e.cancelable) e.preventDefault();
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = getPos(e);

    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
      return;
    }

    if (!startPoint || !shapeSnapshot.current) return;
    ctx.putImageData(shapeSnapshot.current, 0, 0);

    const { x: sx, y: sy } = startPoint;
    ctx.beginPath();

    if (tool === "rect") {
        ctx.strokeRect(sx, sy, x - sx, y - sy);
    } else if (tool === "circle") {
        const r = Math.sqrt(Math.pow(x - sx, 2) + Math.pow(y - sy, 2));
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPoint(null);
    shapeSnapshot.current = null;
  };

  const floodFill = (x: number, y: number, fillHex: string) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const targetIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
    const targetColor = { r: data[targetIndex], g: data[targetIndex + 1], b: data[targetIndex + 2], a: data[targetIndex + 3] };
    const fillColor = hexToRGBA(fillHex);

    if (targetColor.r === fillColor.r && targetColor.g === fillColor.g && targetColor.b === fillColor.b) return;

    const stack = [{ x: Math.floor(x), y: Math.floor(y) }];
    while (stack.length > 0) {
      const { x: cx, y: cy } = stack.pop()!;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
      const idx = (cy * width + cx) * 4;
      if (!colorsMatch(data, idx, targetColor)) continue;

      data[idx] = fillColor.r; data[idx + 1] = fillColor.g; data[idx + 2] = fillColor.b; data[idx + 3] = fillColor.a;
      stack.push({ x: cx + 1, y: cy }, { x: cx - 1, y: cy }, { x: cx, y: cy + 1 }, { x: cx, y: cy - 1 });
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const clearCanvas = () => {
      saveState();
      const ctx = ctxRef.current;
      if(ctx && canvasRef.current) {
          ctx.fillStyle = CANVAS_BG;
          ctx.fillRect(0,0,canvasRef.current.width, canvasRef.current.height);
      }
  };

  const download = () => {
      const link = document.createElement("a");
      link.href = canvasRef.current?.toDataURL("image/png") || "";
      link.download = "rextoon-art.png";
      link.click();
  };

  return (
    <section id="draw" className="py-10">
      <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
        {/* FIXED: Removed font-bold */}
        <h3 className="text-3xl font-silkscreen text-white tracking-tighter">
          CREATION <span className="text-[#4ADE80]">SUITE</span>
        </h3>
        <span className="text-xs font-mono text-slate-500">V2.0 PAINT</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[650px]">

        {/* --- LEFT SIDEBAR (TOOLS) --- */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex flex-col gap-6 lg:w-[260px] shrink-0 shadow-xl">

           {/* Tools Grid */}
           <div>
               <label className="text-[10px] text-slate-500 font-silkscreen uppercase tracking-widest mb-3 block">Tools</label>
               <div className="grid grid-cols-4 gap-2">
                   {[
                       { id: 'brush', icon: <Icons.Pencil /> },
                       { id: 'eraser', icon: <Icons.Eraser /> },
                       { id: 'fill', icon: <Icons.Fill /> },
                       { id: 'undo', icon: <Icons.Undo />, action: undo },
                       { id: 'rect', icon: <Icons.Rect /> },
                       { id: 'circle', icon: <Icons.Circle /> },
                   ].map((item) => (
                       <button
                           key={item.id}
                           onClick={() => item.action ? item.action() : setTool(item.id as any)}
                           className={`aspect-square flex items-center justify-center rounded transition-all ${
                               !item.action && tool === item.id
                               ? 'bg-[#4ADE80] text-black shadow-lg shadow-emerald-500/20'
                               : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                           }`}
                       >
                           {item.icon}
                       </button>
                   ))}
               </div>
           </div>

           {/* Palette */}
           <div>
               <label className="text-[10px] text-slate-500 font-silkscreen uppercase tracking-widest mb-3 block">Color</label>
               <div className="grid grid-cols-6 gap-2">
                   {palette.map(c => (
                       <button
                           key={c}
                           onClick={() => { setBrushColor(c); if(tool==='eraser') setTool('brush'); }}
                           style={{ backgroundColor: c }}
                           className={`w-full aspect-square rounded-sm border-2 transition-transform ${brushColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                       />
                   ))}
               </div>
           </div>

           {/* Size Slider */}
           <div>
               <label className="text-[10px] text-slate-500 font-silkscreen uppercase tracking-widest mb-3 block">Size: {brushSize}px</label>
               <input
                   type="range" min="1" max="40" value={brushSize}
                   onChange={(e) => setBrushSize(Number(e.target.value))}
                   className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4ADE80]"
               />
           </div>

           {/* Actions */}
           <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
               {/* FIXED: Removed font-bold */}
               <button onClick={download} className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-silkscreen text-xs uppercase tracking-widest rounded hover:bg-[#4ADE80] transition-colors">
                   <Icons.Download /> Save Art
               </button>
               {/* FIXED: Removed font-bold */}
               <button onClick={clearCanvas} className="flex items-center justify-center gap-2 w-full py-3 bg-red-900/20 text-red-400 font-silkscreen text-xs uppercase tracking-widest rounded hover:bg-red-900/40 transition-colors border border-red-900/50">
                   <Icons.Trash /> Clear
               </button>
           </div>
        </div>

        {/* --- RIGHT: CANVAS AREA --- */}
        <div className="flex-1 bg-[#222] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
            <div className="h-8 bg-[#333] border-b border-white/5 flex items-center px-4">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"/>
                </div>
                <span className="mx-auto text-[10px] font-mono text-slate-500">CANVAS: 100% ZOOM</span>
            </div>

            <div ref={containerRef} className="flex-1 relative cursor-crosshair bg-[#1a1a1a] touch-none">
                <canvas
                    ref={canvasRef}
                    className="block touch-none"
                    onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
            </div>
        </div>

      </div>
    </section>
  );
}
