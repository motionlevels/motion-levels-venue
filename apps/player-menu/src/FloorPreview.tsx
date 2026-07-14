import { useEffect, useRef } from "react";
import { drawFloorCanvas, floorDisplayCells, type FloorBoardCell } from "@motion-levels/floor-view";
import { FLOOR_COLS, FLOOR_ROWS, type FloorAnim } from "./floor";

const PITCH = 14; // device pixels per LED (lit cell + gap)
const GAP = 2;
const LIT = PITCH - GAP;
const IDLE: [number, number, number] = [13, 19, 30]; // unlit LED, matches controller preview tile tone
const IDLE_CSS = `rgb(${IDLE[0]}, ${IDLE[1]}, ${IDLE[2]})`;
type FloorPreviewOrientation = "portrait" | "landscape";

// Renders the 16x32 LED floor as crisp tiles on a canvas and
// loops the given per-game animation. Each preview pauses outside the viewport or while the
// tab is hidden, and falls back to a single static frame under prefers-reduced-motion.
export function FloorPreview({
  anim,
  orientation = "portrait",
  fps = 50,
}: {
  anim: FloorAnim;
  orientation?: FloorPreviewOrientation;
  fps?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const targetCanvas = canvas;

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
      const aspect = width / height;
      // The kiosk frame is transform-scaled to preserve its 16:9 shape.
      // Measure layout pixels here so canvas previews are not scaled twice.
      const maxWidth = Math.max(1, parent.clientWidth - 8);
      const maxHeight = Math.max(1, parent.clientHeight - 8);
      const cssWidth = Math.floor(Math.min(maxWidth, maxHeight * aspect));
      targetCanvas.style.width = `${cssWidth}px`;
    }

    fitCanvas();
    const resizeObserver = new ResizeObserver(fitCanvas);
    if (targetCanvas.parentElement) resizeObserver.observe(targetCanvas.parentElement);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw(seconds: number) {
      const cells: FloorBoardCell[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let [r, g, b] = anim(x, y, cols, rows, seconds);
          if (r + g + b < 14) [r, g, b] = IDLE;
          cells.push({ x, y, color: `rgb(${r | 0}, ${g | 0}, ${b | 0})` });
        }
      }
      drawFloorCanvas({
        canvas: targetCanvas,
        ...floorDisplayCells(cols, rows, cells, landscape ? "clockwise" : "data", IDLE_CSS),
        emptyColor: "#05070a",
        tileSize: LIT,
        gapSize: GAP,
      });
    }

    draw(2.4);
    if (reduceMotion) return () => resizeObserver.disconnect();

    const interval = 1000 / Math.max(1, Math.min(60, fps));
    let raf = 0;
    let last = -1;
    let inViewport = true;

    function shouldAnimate() {
      return !document.hidden && inViewport;
    }

    function frame(nowMs: number) {
      raf = 0;
      if (!shouldAnimate()) return;
      if (nowMs - last >= interval) {
        last = nowMs;
        draw(nowMs / 1000);
      }
      raf = requestAnimationFrame(frame);
    }

    function updateAnimation() {
      if (!shouldAnimate()) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      if (raf) return;
      last = -1;
      raf = requestAnimationFrame(frame);
    }

    const intersectionObserver = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          inViewport = entry?.isIntersecting ?? true;
          updateAnimation();
        }, { rootMargin: "80px" });
    intersectionObserver?.observe(targetCanvas);
    updateAnimation();
    document.addEventListener("visibilitychange", updateAnimation);
    return () => {
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", updateAnimation);
    };
  }, [anim, fps, orientation]);

  return <canvas ref={canvasRef} className="floor-canvas" aria-hidden="true" />;
}
