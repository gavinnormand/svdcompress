import { useRef, useState } from "react";

function ImageCompare({
  before,
  after,
  k,
}: {
  before: string;
  after: string;
  k: number;
}) {
  const [split, setSplit] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSplit = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSplit(
      Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-col-resize overflow-hidden select-none"
      onMouseDown={(e) => {
        dragging.current = true;
        updateSplit(e.clientX);
      }}
      onMouseMove={(e) => {
        if (dragging.current) updateSplit(e.clientX);
      }}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
    >
      <img src={after} className="block w-full" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        <img src={before} className="block w-full" draggable={false} />
      </div>
      <div
        className="absolute top-0 h-full"
        style={{ left: `${split}%`, transform: "translateX(-50%)" }}
      >
        <div className="relative h-full w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.6)]">
          <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold text-[#304674] shadow-md">
            ↔
          </div>
        </div>
      </div>
      <span className="absolute top-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
        Original
      </span>
      <span className="absolute top-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
        Compressed (k = {k})
      </span>
    </div>
  );
}

export default ImageCompare;
