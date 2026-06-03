import { useEffect, useRef, useState } from "react";
import { FLOOR_COLS, FLOOR_ROWS } from "./floor";

const PITCH = 14;
const GAP = 2;
const LIT = PITCH - GAP;
const IDLE: [number, number, number] = [13, 19, 30];

type ConnectionState = "connecting" | "live" | "error";

type PressureMessage = {
  type?: string;
  x?: number;
  y?: number;
  pressed?: boolean;
};

function controllerWebSocketURL(): string {
  const configured = import.meta.env.VITE_FLOOR_CONTROLLER_URL;
  if (configured) {
    const url = new URL(configured, window.location.href);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws";
    url.search = "";
    return url.toString();
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.hostname || "127.0.0.1";
  return `${protocol}://${host}:8080/ws`;
}

export function LiveFloorView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<Uint8Array | null>(null);
  const frameSizeRef = useRef({ width: FLOOR_COLS, height: FLOOR_ROWS });
  const pressedRef = useRef<Set<number>>(new Set());
  const reconnectRef = useRef<number | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const targetCanvas = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const displayCols = FLOOR_ROWS;
    const displayRows = FLOOR_COLS;
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
      const maxWidth = Math.max(1, rect.width - 20);
      const maxHeight = Math.max(1, rect.height - 20);
      const cssWidth = Math.floor(Math.min(maxWidth, maxHeight * aspect));
      targetCanvas.style.width = `${cssWidth}px`;
    }

    function logicalToDraw(x: number, y: number) {
      return {
        x: GAP + y * PITCH,
        y: GAP + (FLOOR_COLS - 1 - x) * PITCH,
      };
    }

    function draw() {
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);
      const frame = frameRef.current;
      const frameSize = frameSizeRef.current;
      for (let y = 0; y < FLOOR_ROWS; y++) {
        for (let x = 0; x < FLOOR_COLS; x++) {
          const index = y * FLOOR_COLS + x;
          let r = IDLE[0];
          let g = IDLE[1];
          let b = IDLE[2];
          if (frame && x < frameSize.width && y < frameSize.height) {
            const rgbIndex = (y * frameSize.width + x) * 3;
            r = frame[rgbIndex] || 0;
            g = frame[rgbIndex + 1] || 0;
            b = frame[rgbIndex + 2] || 0;
            if (r + g + b < 14) [r, g, b] = IDLE;
          }
          const drawPt = logicalToDraw(x, y);
          ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
          ctx.fillRect(drawPt.x, drawPt.y, LIT, LIT);
          if (pressedRef.current.has(index)) {
            ctx.strokeStyle = "#ff334f";
            ctx.lineWidth = 3;
            ctx.strokeRect(drawPt.x + 1.5, drawPt.y + 1.5, LIT - 3, LIT - 3);
          }
        }
      }
    }

    function applyFrame(buffer: ArrayBuffer) {
      const view = new DataView(buffer);
      if (view.byteLength < 16 || view.getUint8(0) !== 77 || view.getUint8(1) !== 76 || view.getUint8(2) !== 70 || view.getUint8(3) !== 49) return;
      const frameWidth = view.getUint16(8, true);
      const frameHeight = view.getUint16(10, true);
      const flags = view.getUint8(12);
      const headerLength = view.getUint16(14, true);
      const tileCount = frameWidth * frameHeight;
      const rgbOffset = headerLength;
      const pressureOffset = rgbOffset + tileCount * 3;
      const bytes = new Uint8Array(buffer);
      if (bytes.length < pressureOffset) return;

      frameSizeRef.current = { width: frameWidth, height: frameHeight };
      frameRef.current = bytes.slice(rgbOffset, pressureOffset);
      if (flags & 1 && bytes.length >= pressureOffset + Math.ceil(tileCount / 8)) {
        const pressed = new Set<number>();
        for (let index = 0; index < tileCount; index++) {
          if (bytes[pressureOffset + Math.floor(index / 8)] & (1 << (index % 8))) pressed.add(index);
        }
        pressedRef.current = pressed;
      }
      draw();
    }

    function applyPressure(message: PressureMessage) {
      if (message.type !== "pressure" || typeof message.x !== "number" || typeof message.y !== "number") return;
      if (message.x < 0 || message.x >= FLOOR_COLS || message.y < 0 || message.y >= FLOOR_ROWS) return;
      const index = message.y * FLOOR_COLS + message.x;
      const pressed = new Set(pressedRef.current);
      if (message.pressed) pressed.add(index);
      else pressed.delete(index);
      pressedRef.current = pressed;
      draw();
    }

    fitCanvas();
    draw();
    const resizeObserver = new ResizeObserver(fitCanvas);
    if (targetCanvas.parentElement) resizeObserver.observe(targetCanvas.parentElement);

    let socket: WebSocket | null = null;
    let closed = false;

    function connect() {
      if (closed) return;
      setConnection("connecting");
      socket = new WebSocket(controllerWebSocketURL());
      socket.binaryType = "arraybuffer";
      socket.addEventListener("open", () => setConnection("live"));
      socket.addEventListener("message", (event) => {
        if (event.data instanceof ArrayBuffer) {
          applyFrame(event.data);
          return;
        }
        try {
          applyPressure(JSON.parse(event.data) as PressureMessage);
        } catch {
          // Ignore status/config text messages here; the controller view owns those details.
        }
      });
      socket.addEventListener("error", () => setConnection("error"));
      socket.addEventListener("close", () => {
        if (closed) return;
        setConnection("error");
        reconnectRef.current = window.setTimeout(connect, 600);
      });
    }

    connect();
    return () => {
      closed = true;
      resizeObserver.disconnect();
      if (reconnectRef.current !== null) window.clearTimeout(reconnectRef.current);
      socket?.close();
    };
  }, []);

  return (
    <div className={`live-floor ${connection}`}>
      <canvas ref={canvasRef} className="live-floor-canvas" aria-label="Estado real del suelo LED" />
      <span className="live-floor-status">{connection === "live" ? "Suelo en vivo" : connection === "connecting" ? "Conectando al suelo" : "Sin señal del suelo"}</span>
    </div>
  );
}
