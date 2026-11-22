import { useRef, useCallback } from "react";

interface VerticalWheelPickerProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix?: string;
}

export default function VerticalWheelPicker({
  value, onChange, min, max, suffix = "",
}: VerticalWheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastY = useRef(0);
  const accum = useRef(0);

  const ITEM_HEIGHT = 72;
  const VISIBLE = 5;
  const HALF = Math.floor(VISIBLE / 2);
  const STEP_THRESHOLD = 28; // px needed to advance one step

  const clamp = useCallback(
    (v: number) => Math.max(min, Math.min(max, Math.round(v))),
    [min, max]
  );

  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const v = value - HALF + i;
    return { v, offset: i - HALF };
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    lastY.current = e.clientY;
    accum.current = 0;
    // Capture on the container so move events always arrive here
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dy = e.clientY - lastY.current;
    lastY.current = e.clientY;
    accum.current -= dy; // drag up → positive accum → increase value

    if (Math.abs(accum.current) >= STEP_THRESHOLD) {
      const steps = Math.trunc(accum.current / STEP_THRESHOLD);
      onChange(clamp(value + steps));
      accum.current -= steps * STEP_THRESHOLD;
    }
  };

  const onPointerUp = () => {
    isDragging.current = false;
    accum.current = 0;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 1 : -1;
    onChange(clamp(value + delta));
  };

  return (
    <div
      ref={containerRef}
      className="relative select-none cursor-ns-resize overflow-hidden touch-none"
      style={{ height: VISIBLE * ITEM_HEIGHT, width: "100%", maxWidth: 340 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {items.map(({ v, offset }) => {
        const dist = Math.abs(offset);
        const isCenter = offset === 0;
        const isValid = v >= min && v <= max;

        const sizes   = [80, 50, 36, 28, 22];
        const opacity = isValid ? [1, 0.5, 0.28, 0.15, 0.07][dist] ?? 0 : 0;
        const color   = isCenter ? "#4B5FE8" : "#C9D0F8";
        const fontSize = sizes[dist] ?? 18;

        return (
          <div
            key={`${v}-${offset}`}
            onClick={() => isValid && !isCenter && onChange(clamp(v))}
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{
              top: (offset + HALF) * ITEM_HEIGHT,
              height: ITEM_HEIGHT,
              opacity,
              transition: "opacity 0.12s ease, transform 0.12s ease",
              cursor: isCenter ? "ns-resize" : "pointer",
            }}
          >
            <span
              className="font-serif leading-none pointer-events-none"
              style={{ fontSize, color, fontWeight: isCenter ? 400 : 300 }}
            >
              {isValid ? v : ""}
            </span>
            {isCenter && suffix && (
              <span
                className="text-[#111] font-normal pointer-events-none"
                style={{ fontSize: 22, lineHeight: 1, paddingTop: 10, marginLeft: 10 }}
              >
                {suffix}
              </span>
            )}
          </div>
        );
      })}

      {/* +/- tap zones for mobile */}
      <button
        className="absolute inset-x-0 top-0 h-[30%] z-10 opacity-0"
        onClick={() => onChange(clamp(value - 1))}
        aria-label="decrease"
      />
      <button
        className="absolute inset-x-0 bottom-0 h-[30%] z-10 opacity-0"
        onClick={() => onChange(clamp(value + 1))}
        aria-label="increase"
      />

      {/* Fade top / bottom */}
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none"
           style={{ background: "linear-gradient(to bottom, #F9F8FF 10%, transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
           style={{ background: "linear-gradient(to top, #F9F8FF 10%, transparent)" }} />
    </div>
  );
}
