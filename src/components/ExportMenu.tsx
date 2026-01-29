import { useState, useRef, useEffect } from "react";
import { exportSvg, exportPng } from "../lib/export";

interface ExportMenuProps {
  svg: string;
}

const PNG_SCALES = [1, 2, 3, 4] as const;

export function ExportMenu({ svg }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [customScale, setCustomScale] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const disabled = !svg;

  function handleCustomExport() {
    const scale = parseFloat(customScale);
    if (!scale || scale <= 0 || scale > 16) return;
    exportPng(svg, scale);
    setOpen(false);
    setCustomScale("");
  }

  return (
    <div className="export-menu" ref={ref}>
      <button
        className="export-btn"
        onClick={() => setOpen(!open)}
        disabled={disabled}
      >
        Export
      </button>
      {open && (
        <div className="export-dropdown">
          <button
            className="export-option"
            onClick={() => {
              exportSvg(svg);
              setOpen(false);
            }}
          >
            SVG
          </button>
          <div className="export-divider" />
          {PNG_SCALES.map((scale) => (
            <button
              key={scale}
              className="export-option"
              onClick={() => {
                exportPng(svg, scale);
                setOpen(false);
              }}
            >
              PNG {scale}x
            </button>
          ))}
          <div className="export-divider" />
          <div className="export-custom">
            <input
              ref={inputRef}
              type="number"
              className="export-custom-input"
              placeholder="Custom"
              min="0.5"
              max="16"
              step="0.5"
              value={customScale}
              onChange={(e) => setCustomScale(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCustomExport();
              }}
            />
            <button
              className="export-custom-btn"
              onClick={handleCustomExport}
              disabled={
                !customScale ||
                parseFloat(customScale) <= 0 ||
                parseFloat(customScale) > 16
              }
            >
              PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
