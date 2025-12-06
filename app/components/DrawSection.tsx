"use client";

import React, { useEffect, useRef, useState } from "react";

type DrawSectionProps = {
  headingClassName?: string;
};

type Tool = "brush" | "eraser" | "line" | "rect" | "circle" | "fill";

type Template = {
  id: string;
  name: string;
  src: string;
};

// 🧩 Your actual Rex outline templates (from public/templates)
const TEMPLATES: Template[] = [
  {
    id: "rex1",
    name: "Rex Pose 1",
    src: "/templates/IMG_20251206_125738-outline.png",
  },
  {
    id: "rex2",
    name: "Rex Pose 2",
    src: "/templates/IMG_20251206_125830-outline.png",
  },
  {
    id: "rex3",
    name: "Rex Pose 3",
    src: "/templates/IMG_20251206_125852-outline.png",
  },
  {
    id: "rex4",
    name: "Rex Pose 4",
    src: "/templates/IMG_20251206_125911-outline.png",
  },
];

const DOODLE_PROMPTS = [
  "Rex riding a Bitcoin rocket 🚀",
  "Rex crying over gas fees ⛽😢",
  "Rex sleeping on a pile of memecoins 😴",
  "Rex holding a 'WAGMI' sign 📢",
  "Rex surfing a green candle 📈",
  "Rex trapped in a red candle 📉",
  "Rex sending a wagmi tweet on X 🐦",
  "Rex with laser eyes in a bull market 🐂",
];

const PAPER_COLOR = "#fdfaf3"; // notebook paper colour

function hexToRGBA(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 255,
  };
}

function colorsMatch(
  data: Uint8ClampedArray,
  index: number,
  target: { r: number; g: number; b: number; a: number }
) {
  return (
    data[index] === target.r &&
    data[index + 1] === target.g &&
    data[index + 2] === target.b &&
    data[index + 3] === target.a
  );
}

export default function DrawSection({ headingClassName }: DrawSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#0f172a"); // dark pen
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<Tool>("brush");
  const [customColor, setCustomColor] = useState("#0f172a");
  const [prompt, setPrompt] = useState<string | null>(null);

  // for shapes
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const shapePreviewBaseRef = useRef<ImageData | null>(null);

  // undo / redo history
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);

  // template images
  const templateImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  // --- helpers ---
  const initCanvasBackground = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // notebook style border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // vertical margin line
    ctx.beginPath();
    ctx.moveTo(70, 18);
    ctx.lineTo(70, canvas.height - 18);
    ctx.stroke();
  };

  const saveHistorySnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const history = historyRef.current;

    history.splice(historyIndexRef.current + 1);
    history.push(imgData);

    if (history.length > 25) {
      history.shift();
    }

    historyIndexRef.current = history.length - 1;
  };

  const restoreFromHistory = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const history = historyRef.current;
    const snap = history[index];
    if (!snap) return;

    ctx.putImageData(snap, 0, 0);
    historyIndexRef.current = index;
  };

  // --- init canvas once ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 450;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;

    ctxRef.current = ctx;

    initCanvasBackground();
    saveHistorySnapshot();
  }, []);

  // load all template images once
  useEffect(() => {
    if (TEMPLATES.length === 0) {
      setTemplatesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const images: Record<string, HTMLImageElement> = {};

    TEMPLATES.forEach((tpl) => {
      const img = new Image();
      img.src = tpl.src;
      img.onload = () => {
        images[tpl.id] = img;
        loadedCount += 1;
        if (loadedCount === TEMPLATES.length) {
          templateImagesRef.current = images;
          setTemplatesLoaded(true);
        }
      };
      img.onerror = () => {
        // even if one fails, we still count it as "loaded" to avoid blocking
        loadedCount += 1;
        if (loadedCount === TEMPLATES.length) {
          templateImagesRef.current = images;
          setTemplatesLoaded(true);
        }
      };
    });
  }, []);

  // update drawing settings when options change
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineWidth = brushSize;

    if (tool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = PAPER_COLOR;
    } else {
      // shapes & fill use brush colour by default
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }
  }, [brushColor, brushSize, tool]);

  // --- pointer helpers ---
  const getCanvasPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const t = e.touches[0];
      return {
        x: ((t.clientX - rect.left) / rect.width) * canvas.width,
        y: ((t.clientY - rect.top) / rect.height) * canvas.height,
      };
    } else {
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      };
    }
  };

  const floodFill = (x: number, y: number, fillHex: string) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const targetIndex =
      (Math.floor(y) * width + Math.floor(x)) * 4;

    const targetColor = {
      r: data[targetIndex],
      g: data[targetIndex + 1],
      b: data[targetIndex + 2],
      a: data[targetIndex + 3],
    };
    const fillColor = hexToRGBA(fillHex);

    if (
      targetColor.r === fillColor.r &&
      targetColor.g === fillColor.g &&
      targetColor.b === fillColor.b &&
      targetColor.a === fillColor.a
    ) {
      return;
    }

    const stack: { x: number; y: number }[] = [
      { x: Math.floor(x), y: Math.floor(y) },
    ];

    while (stack.length > 0) {
      const { x: cx, y: cy } = stack.pop()!;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

      const idx = (cy * width + cx) * 4;
      if (!colorsMatch(data, idx, targetColor)) continue;

      data[idx] = fillColor.r;
      data[idx + 1] = fillColor.g;
      data[idx + 2] = fillColor.b;
      data[idx + 3] = fillColor.a;

      stack.push(
        { x: cx + 1, y: cy },
        { x: cx - 1, y: cy },
        { x: cx, y: cy + 1 },
        { x: cx, y: cy - 1 }
      );
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { x, y } = getCanvasPos(e);

    if (tool === "fill") {
      saveHistorySnapshot();
      floodFill(x, y, brushColor);
      return;
    }

    // save state BEFORE action for undo
    saveHistorySnapshot();

    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    } else {
      // shape tools
      setStartPoint({ x, y });
      shapePreviewBaseRef.current = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      setIsDrawing(true);
    }
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { x, y } = getCanvasPos(e);

    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
      return;
    }

    // shape preview
    if (!startPoint || !shapePreviewBaseRef.current) return;

    ctx.putImageData(shapePreviewBaseRef.current, 0, 0);

    const { x: sx, y: sy } = startPoint;

    if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "rect") {
      const w = x - sx;
      const h = y - sy;
      ctx.strokeRect(sx, sy, w, h);
    } else if (tool === "circle") {
      const dx = x - sx;
      const dy = y - sy;
      const radius = Math.sqrt(dx * dx + dy * dy);
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPoint(null);
    shapePreviewBaseRef.current = null;
  };

  const handleClear = () => {
    initCanvasBackground();
    saveHistorySnapshot();
  };

  const handleUndo = () => {
    const newIndex = historyIndexRef.current - 1;
    if (newIndex >= 0) {
      restoreFromHistory(newIndex);
    }
  };

  const handleRedo = () => {
    const history = historyRef.current;
    const newIndex = historyIndexRef.current + 1;
    if (newIndex < history.length) {
      restoreFromHistory(newIndex);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "rextoon-doodle.png";
    link.click();
  };

  const handleNewPrompt = () => {
    const random =
      DOODLE_PROMPTS[Math.floor(Math.random() * DOODLE_PROMPTS.length)];
    setPrompt(random);
  };

  const handleStampTemplate = (templateId: string) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const img = templateImagesRef.current[templateId];
    if (!img) return;

    saveHistorySnapshot();

    const targetHeight = canvas.height * 0.6; // 60% of canvas height
    const scale = targetHeight / img.height;
    const targetWidth = img.width * scale;

    const x = canvas.width / 2 - targetWidth / 2;
    const y = canvas.height / 2 - targetHeight / 2;

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, x, y, targetWidth, targetHeight);
  };

  const palette = [
    "#0f172a", // dark pen
    "#ef4444", // red
    "#f97316", // orange
    "#facc15", // yellow
    "#22c55e", // green
    "#14b8a6", // teal
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#a855f7", // purple
    "#ec4899", // pink
    "#000000", // black
    "#ffffff", // white
  ];

  return (
    <section id="draw" className="mb-16 md:mb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
        <div>
          <h3
            className={`${headingClassName} text-lg md:text-xl text-emerald-50`}
          >
            REXTOON Sketchbook
          </h3>
          <p className="text-[0.78rem] md:text-xs text-emerald-100/85 max-w-md mt-1">
            Draw, drop Rex templates and colour them like a Web3 colouring
            book.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[0.7rem]">
          <span className="px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300">
            ✏️ Sketch & shapes
          </span>
          <span className="px-2.5 py-1 rounded-full bg-sky-100/90 text-sky-900 border border-sky-300">
            🎨 Fill & colours
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300">
            ⬇️ Save your doodle
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,1.1fr)] gap-4 md:gap-6 items-start">
        {/* Canvas side */}
        <div className="w-full">
          <div className="relative rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-slate-50 to-emerald-50 shadow-[0_18px_40px_rgba(15,23,42,0.35)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
            <canvas
              ref={canvasRef}
              className="relative block w-full aspect-[2/1] touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <p className="mt-2 text-[0.7rem] text-emerald-100/80">
            Tip: stamp a Rex template, then use the fill bucket + brush to
            colour cap, hoodie and tail.
          </p>
        </div>

        {/* Tool panel */}
        <div className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white/95 px-4 py-4 md:px-5 md:py-5 shadow-[0_18px_35px_rgba(15,23,42,0.25)] space-y-4 text-slate-900">
            {/* Tools */}
            <div>
              <div className="mb-2 text-xs font-semibold text-slate-800">
                Tools
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTool("brush")}
                  className={`px-3 py-1.5 rounded-xl text-[0.75rem] border ${
                    tool === "brush"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:border-emerald-400"
                  }`}
                >
                  ✏️ Brush
                </button>
                <button
                  type="button"
                  onClick={() => setTool("eraser")}
                  className={`px-3 py-1.5 rounded-xl text-[0.75rem] border ${
                    tool === "eraser"
                      ? "bg-sky-400 text-white border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:border-sky-400"
                  }`}
                >
                  🧽 Eraser
                </button>
                <button
                  type="button"
                  onClick={() => setTool("fill")}
                  className={`px-3 py-1.5 rounded-xl text-[0.75rem] border ${
                    tool === "fill"
                      ? "bg-amber-400 text-white border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:border-amber-400"
                  }`}
                >
                  🪣 Fill
                </button>
                <button
                  type="button"
                  onClick={() => setTool("line")}
                  className={`px-3 py-1.5 rounded-xl text-[0.75rem] border ${
                    tool === "line"
                      ? "bg-slate-900 text-white border-slate-900 shadow-[0_0_10px_rgba(15,23,42,0.6)]"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-700"
                  }`}
                >
                  ➖ Line
                </button>
                <button
                  type="button"
                  onClick={() => setTool("rect")}
                  className={`px-3 py-1.5 rounded-xl text-[0.75rem] border ${
                    tool === "rect"
                      ? "bg-slate-900 text-white border-slate-900 shadow-[0_0_10px_rgba(15,23,42,0.6)]"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-700"
                  }`}
                >
                  ▭ Rect
                </button>
                <button
                  type="button"
                  onClick={() => setTool("circle")}
                  className={`px-3 py-1.5 rounded-xl text-[0.75rem] border ${
                    tool === "circle"
                      ? "bg-slate-900 text-white border-slate-900 shadow-[0_0_10px_rgba(15,23,42,0.6)]"
                      : "bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-700"
                  }`}
                >
                  ◯ Circle
                </button>
              </div>
            </div>

            {/* Template buttons */}
            {TEMPLATES.length > 0 && (
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-800">
                  Rex templates
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      disabled={!templatesLoaded}
                      onClick={() => handleStampTemplate(tpl.id)}
                      className={`px-3 py-1.5 rounded-xl text-[0.72rem] border flex items-center gap-1 ${
                        templatesLoaded
                          ? "bg-orange-50 border-orange-200 text-orange-900 hover:bg-orange-100 transition-colors"
                          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span>📎</span>
                      <span className="truncate max-w-[7rem]">{tpl.name}</span>
                    </button>
                  ))}
                </div>
                {!templatesLoaded && (
                  <p className="mt-1 text-[0.65rem] text-slate-500">
                    Loading outlines…
                  </p>
                )}
              </div>
            )}

            {/* Colours */}
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-800">
                Colours
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {palette.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setTool("brush");
                      setBrushColor(c);
                      setCustomColor(c);
                    }}
                    className={`w-7 h-7 rounded-full border transition-transform ${
                      brushColor === c && tool !== "eraser"
                        ? "border-slate-900 scale-110 shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                        : "border-slate-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomColor(v);
                    setBrushColor(v);
                    setTool("brush");
                  }}
                  className="w-8 h-8 rounded-md border border-slate-300 p-0 cursor-pointer"
                />
                <span className="text-[0.7rem] text-slate-600">
                  Custom colour
                </span>
              </div>
            </div>

            {/* Brush size */}
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-800">
                Brush / shape size
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="mt-0.5 text-[0.7rem] text-slate-500">
                {brushSize}px
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleUndo}
                className="px-3 py-1.5 rounded-xl text-[0.72rem] bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
              >
                ↩️ Undo
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="px-3 py-1.5 rounded-xl text-[0.72rem] bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
              >
                ↪️ Redo
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl text-[0.72rem] bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 transition-colors"
              >
                🗑️ Clear page
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl text-[0.72rem] bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-400 transition-colors ml-auto"
              >
                ⬇️ Download PNG
              </button>
            </div>

            {/* Doodle prompt */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={handleNewPrompt}
                className="px-3 py-1.5 rounded-xl text-[0.72rem] bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200 transition-colors"
              >
                🎲 Give me a doodle idea
              </button>
              {prompt && (
                <p className="text-[0.72rem] text-slate-700 leading-relaxed">
                  <span className="font-semibold">Prompt:</span> {prompt}
                </p>
              )}
              {!prompt && (
                <p className="text-[0.7rem] text-slate-500">
                  Stuck? Tap the button to get a random Rex doodle idea.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
