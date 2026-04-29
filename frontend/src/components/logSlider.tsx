import { useRef } from "react";

function LogSlider({
  min,
  max,
  value,
  onChange,
  className,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const logMin = Math.log(min);
  const logMax = Math.log(max);

  const kToFrac = (k: number) => (Math.log(k) - logMin) / (logMax - logMin);
  const fracToK = (frac: number) =>
    Math.round(Math.exp(logMin + frac * (logMax - logMin)));

  const updateFromX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    onChange(fracToK(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    updateFromX(e.clientX);
    const onMove = (ev: MouseEvent) => updateFromX(ev.clientX);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const NUM_TICKS = 6;
  const ticks = [
    ...new Set(
      Array.from({ length: NUM_TICKS }, (_, i) =>
        Math.round(Math.exp(logMin + (i / (NUM_TICKS - 1)) * (logMax - logMin))),
      ),
    ),
  ];

  const thumbPct = kToFrac(value) * 100;

  return (
    <div
      className={`cursor-pointer px-2 pb-5 ${className ?? ""}`}
      style={{ userSelect: "none" }}
      onMouseDown={onMouseDown}
    >
      <div className="relative flex h-4 items-center">
        <div ref={trackRef} className="relative h-1.5 w-full rounded-full bg-white/25">
          <div
            className="pointer-events-none absolute h-full rounded-full bg-white"
            style={{ width: `${thumbPct}%` }}
          />
          {ticks.map((t) => (
            <div
              key={t}
              className="pointer-events-none absolute top-full flex flex-col items-center"
              style={{ left: `${kToFrac(t) * 100}%`, transform: "translateX(-50%)" }}
            >
              <div className="mt-1 h-1.5 w-px bg-white/50" />
              <span className="mt-0.5 text-[10px] text-white/60">{t}</span>
            </div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md"
          style={{ left: `${thumbPct}%` }}
        />
      </div>
    </div>
  );
}

export default LogSlider;
