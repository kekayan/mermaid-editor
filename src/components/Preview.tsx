import { useState, useRef, useCallback, useEffect } from "react";

interface PreviewProps {
  svg: string;
  error: string | null;
  bg: string;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.15;

export function Preview({ svg, error, bg }: PreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((prev) => clampZoom(prev - e.deltaY * 0.005));
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1) return;
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [zoom]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="preview-panel"
      ref={panelRef}
      style={{ backgroundColor: bg, cursor: zoom > 1 ? "grab" : "default" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {error ? (
        <div className="preview-error">
          <pre>{error}</pre>
        </div>
      ) : (
        <div
          className="preview-svg"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center top",
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      <div className="zoom-controls">
        <button
          className="zoom-btn"
          onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
          disabled={zoom <= MIN_ZOOM}
          title="Zoom out"
        >
          −
        </button>
        <button
          className="zoom-label"
          onClick={resetView}
          title="Reset zoom"
        >
          {zoomPercent}%
        </button>
        <button
          className="zoom-btn"
          onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
          disabled={zoom >= MAX_ZOOM}
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
