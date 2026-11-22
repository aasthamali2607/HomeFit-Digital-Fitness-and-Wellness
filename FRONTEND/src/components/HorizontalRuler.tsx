import { useRef, useEffect, useCallback, useState } from "react";

interface HorizontalRulerProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;       // smallest increment (e.g. 0.1)
  majorEvery: number; // label every N units (e.g. 1 for kg, 10 for lbs)
  pxPerStep: number;  // pixels per step
  unit?: string;
}

export default function HorizontalRuler({
  value, onChange, min, max, step, majorEvery, pxPerStep, unit = "",
}: HorizontalRulerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const animFrame = useRef<number>(0);

  // Convert value → offset from left edge of ruler strip
  // center indicator sits at containerWidth/2
  // offset = distance from left of strip to center indicator = (value - min) / step * pxPerStep
  const valueToOffset = useCallback(
    (v: number) => ((v - min) / step) * pxPerStep,
    [min, step, pxPerStep]
  );

  const offsetToValue = useCallback(
    (offset: number) => {
      const raw = min + (offset / pxPerStep) * step;
      const snapped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, parseFloat(snapped.toFixed(10))));
    },
    [min, max, step, pxPerStep]
  );

  const stripWidth = ((max - min) / step) * pxPerStep + 2;

  // Draw ticks on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const totalSteps = Math.round((max - min) / step);

    for (let i = 0; i <= totalSteps; i++) {
      const v = min + i * step;
      const x = i * pxPerStep;
      const rounded = parseFloat(v.toFixed(8));

      let tickH = 10;
      let color = "#CBD5E1";

      // Major tick: at every majorEvery units
      if (Math.abs(rounded % majorEvery) < step * 0.5) {
        tickH = 28;
        color = "#94A3B8";
      } else if (Math.abs(rounded % (majorEvery / 2)) < step * 0.5) {
        // Medium tick
        tickH = 18;
        color = "#CBD5E1";
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = tickH >= 28 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x, H);
      ctx.lineTo(x, H - tickH);
      ctx.stroke();

      // Draw label at major ticks
      if (tickH >= 28) {
        ctx.fillStyle = "#94A3B8";
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "center";
        const label = Number.isInteger(majorEvery) ? Math.round(rounded).toString() : rounded.toFixed(1);
        ctx.fillText(label, x, H - tickH - 4);
      }
    }
  }, [min, max, step, majorEvery, pxPerStep, stripWidth]);

  // Update strip translation
  const getTranslate = () => {
    const container = containerRef.current;
    if (!container) return 0;
    const centerX = container.clientWidth / 2;
    return centerX - valueToOffset(value);
  };

  // Pointer events
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;

    const container = containerRef.current;
    if (!container) return;
    const centerX = container.clientWidth / 2;
    const currentOffset = centerX - getTranslate();
    const newOffset = currentOffset - dx;
    onChange(offsetToValue(newOffset));
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? step : -step;
    const next = parseFloat((value + delta).toFixed(10));
    onChange(Math.max(min, Math.min(max, Math.round(next / step) * step)));
  };

  const translate = getTranslate();

  return (
    <div className="relative select-none overflow-hidden" style={{ height: 60 }}>
      {/* Ruler strip */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div style={{ transform: `translateX(${translate}px)`, willChange: "transform", width: stripWidth }}>
          <canvas
            ref={canvasRef}
            width={stripWidth}
            height={60}
            style={{ display: "block" }}
          />
        </div>
      </div>

      {/* Center indicator */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px pointer-events-none z-10">
        <div className="w-0.5 h-full" style={{ background: "#4B5FE8" }} />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4B5FE8]" />
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 pointer-events-none ruler-fade-left" />
      <div className="absolute inset-y-0 right-0 w-20 pointer-events-none ruler-fade-right" />
    </div>
  );
}
