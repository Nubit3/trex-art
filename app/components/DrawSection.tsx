"use client";

import React, { useEffect, useRef, useState } from "react";

// --- TEMPLATES & CONFIG ---
type Template = { id: string; name: string; src: string; };

const TEMPLATES: Template[] = [
  { id: "rex1", name: "Rex Pose 1", src: "/templates/IMG_20251206_125738-outline.png" },
  { id: "rex2", name: "Rex Pose 2", src: "/templates/IMG_20251206_125830-outline.png" },
  { id: "rex3", name: "Rex Pose 3", src: "/templates/IMG_20251206_125852-outline.png" },
  { id: "rex4", name: "Rex Pose 4", src: "/templates/IMG_20251206_125911-outline.png" },
];

const palette = [
  "#0f172a", "#ef4444", "#f97316", "#facc15", "#22c55e", "#14b8a6", 
  "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#000000", "#ffffff"
];

const CANVAS_BG = "#ffffff";

// --- HELPER FUNCTIONS ---
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
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#0f172a");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<"brush" | "eraser" | "line" | "rect" | "circle" | "fill">("brush");
  
  // Shapes & History
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const shapePreviewBaseRef = useRef<ImageData | null>(null);
  const templateImagesRef = useRef<Record<string, HTMLImageElement>>({});
  
  // Init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 900;
    canvas.height = 600; // Taller for pro feel

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;
    ctxRef.current = ctx;

    // White Background
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load Templates
    TEMPLATES.forEach((tpl) => {
      const img = new Image();
      img.src = tpl.src;
      img.onload = () => { templateImagesRef.current[tpl.id] = img; };
    });
  }, []);

  // Tool Updates
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    if (tool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = CANVAS_BG;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }
  }, [brushColor, brushSize, tool]);

  // --- DRAWING LOGIC ---
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;
    const { x, y } = getCanvasPos(e);

    if (tool === "fill") {
      floodFill(x, y, brushColor);
      return;
    }

    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    } else {
      setStartPoint({ x, y });
      shapePreviewBaseRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);

    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
      return;
    }

    // Shapes
    if (!startPoint || !shapePreviewBaseRef.current) return;
    ctx.putImageData(shapePreviewBaseRef.current, 0, 0);
    const { x: sx, y: sy } = startPoint;

    ctx.beginPath();
    if (tool === "line") {
      ctx.moveTo(sx, sy); ctx.lineTo(x, y);
    } else if (tool === "rect") {
      ctx.strokeRect(sx, sy, x - sx, y - sy);
    } else if (tool === "circle") {
      const r = Math.sqrt(Math.pow(x - sx, 2) + Math.pow(y - sy, 2));
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
    }
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPoint(null);
    shapePreviewBaseRef.current = null;
  };

  // --- FLOOD FILL LOGIC ---
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

  // --- ACTIONS ---
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = canvasRef.current?.toDataURL("image/png") || "";
    link.download = "rextoon-creation.png";
    link.click();
  };

  const handleStamp = (id: string) => {
      const img = templateImagesRef.current[id];
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if(!img || !ctx || !canvas) return;
      
      const ratio = img.width / img.height;
      const h = canvas.height * 0.7;
      const w = h * ratio;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      
      ctx.drawImage(img, x, y, w, h);
  };

  // --- RENDER ---
  return (
    <section id="draw" className="relative">
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
        <h3 className="text-3xl md:text-4xl font-light tracking-tighter text-white">
          CREATION SUITE
        </h3>
        <span className="font-mono text-xs text-emerald-500">READY</span>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-6 items-start h-[600px]">
        
        {/* LEFT: TOOLBAR */}
        <div className="glass-panel p-4 h-full flex flex-col gap-6 rounded-lg">
            
            {/* Tools */}
            <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">Tools</label>
                <div className="grid grid-cols-2 gap-2">
                    {['brush', 'eraser', 'fill', 'line', 'rect', 'circle'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTool(t as any)}
                            className={`px-3 py-2 text-xs font-mono uppercase border transition-all rounded ${
                                tool === t 
                                ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400' 
                                : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">Palette</label>
                <div className="grid grid-cols-4 gap-2">
                    {palette.map(c => (
                        <button
                            key={c}
                            onClick={() => { setBrushColor(c); setTool('brush'); }}
                            style={{ backgroundColor: c }}
                            className={`w-8 h-8 rounded-sm border ${brushColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Templates */}
            <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">Templates</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {TEMPLATES.map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => handleStamp(t.id)}
                            className="w-10 h-10 bg-white/10 border border-white/10 rounded flex items-center justify-center text-lg hover:bg-white/20"
                        >
                            🦖
                        </button>
                    ))}
                </div>
            </div>

            {/* Brush Size */}
            <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">Size: {brushSize}px</label>
                <input 
                    type="range" min="1" max="40" value={brushSize} 
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
                <button onClick={() => {
                    const ctx = ctxRef.current;
                    if(ctx && canvasRef.current) {
                        ctx.fillStyle = CANVAS_BG;
                        ctx.fillRect(0,0,canvasRef.current.width, canvasRef.current.height);
                    }
                }} className="w-full py-2 border border-red-500/50 text-red-400 text-xs font-bold tracking-widest uppercase hover:bg-red-500/10">
                    CLEAR
                </button>
                <button onClick={handleDownload} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-widest uppercase transition-colors">
                    EXPORT PNG
                </button>
            </div>
        </div>

        {/* RIGHT: CANVAS */}
        <div className="relative h-full bg-[#1a1a1a] flex items-center justify-center border border-white/10 rounded-lg overflow-hidden">
            <canvas
                ref={canvasRef}
                className="shadow-2xl cursor-crosshair max-w-full max-h-full"
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
            />
        </div>

      </div>
    </section>
  );
}
