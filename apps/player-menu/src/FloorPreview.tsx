import { useEffect, useRef } from "react";
import { FLOOR_COLS, FLOOR_ROWS, type FloorAnim } from "./floor";

const PITCH = 14; // device pixels per LED (lit cell + gap)
const GAP = 2;
const LIT = PITCH - GAP;
const IDLE: [number, number, number] = [13, 19, 30]; // unlit LED, matches /live tile tone
const FPS = 30;

type FloorPreviewOrientation = "portrait" | "landscape";

// Renders the 16x32 LED floor as crisp tiles on a canvas and
// loops the given per-game animation. One self-contained rAF loop per card; pauses when the
// tab is hidden and falls back to a single static frame under prefers-reduced-motion.
export function FloorPreview({ anim, orientation = "portrait" }: { anim: FloorAnim; orientation?: FloorPreviewOrientation }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetCanvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const cols = FLOOR_COLS;
    const rows = FLOOR_ROWS;
    const landscape = orientation === "landscape";
    const displayCols = landscape ? rows : cols;
    const displayRows = landscape ? cols : rows;
    const width = displayCols * PITCH + GAP;
    const height = displayRows * PITCH + GAP;
    targetCanvas.width = width;
    targetCanvas.height = height;
    targetCanvas.style.height = "auto";

    function fitCanvas() {
      const parent = targetCanvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const aspect = width / height;
      const maxWidth = Math.max(1, rect.width - 16);
      const maxHeight = Math.max(1, rect.height - 8);
      const cssWidth = Math.floor(Math.min(maxWidth, maxHeight * aspect));
      targetCanvas.style.width = `${cssWidth}px`;
    }

    fitCanvas();
    const resizeObserver = new ResizeObserver(fitCanvas);
    if (targetCanvas.parentElement) resizeObserver.observe(targetCanvas.parentElement);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw(seconds: number) {
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let [r, g, b] = anim(x, y, cols, rows, seconds);
          if (r + g + b < 14) {
            [r, g, b] = IDLE;
          }
          const drawX = landscape ? y : x;
          const drawY = landscape ? cols - 1 - x : y;
          ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
          ctx.fillRect(GAP + drawX * PITCH, GAP + drawY * PITCH, LIT, LIT);
        }
      }
    }

    if (reduceMotion) {
      draw(2.4);
      return () => resizeObserver.disconnect();
    }

    let raf = 0;
    let last = -1;
    const start = performance.now();
    const interval = 1000 / FPS;

    function frame(nowMs: number) {
      raf = requestAnimationFrame(frame);
      if (nowMs - last < interval) return;
      last = nowMs;
      draw((nowMs - start) / 1000);
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = -1;
        raf = requestAnimationFrame(frame);
      }
    }

    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [anim, orientation]);

  return <canvas ref={canvasRef} className="floor-canvas" aria-hidden="true" />;
}
