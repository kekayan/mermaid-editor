import { useCallback, useRef } from "react";
import { Toolbar } from "./components/Toolbar";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import { useDebouncedRender } from "./hooks/useDebouncedRender";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getThemeColors, isColorDark } from "./lib/themes";
import { DEFAULT_DIAGRAM, DEFAULT_THEME } from "./lib/defaults";

export function App() {
  const [code, setCode] = useLocalStorage("mermaid:code", DEFAULT_DIAGRAM);
  const [themeName, setThemeName] = useLocalStorage("mermaid:theme", DEFAULT_THEME);
  const { svg, error } = useDebouncedRender(code, themeName);
  const [splitFraction, setSplitFraction] = useLocalStorage("mermaid:split", 0.5);
  const splitRef = useRef<HTMLDivElement>(null);

  const colors = getThemeColors(themeName);
  const dark = isColorDark(colors.bg);

  const handleSplitPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = splitRef.current;
      if (!el) return;

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();

      const onMove = (ev: PointerEvent) => {
        const fraction = (ev.clientX - rect.left) / rect.width;
        setSplitFraction(Math.min(0.85, Math.max(0.15, fraction)));
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    []
  );

  const leftPercent = `${splitFraction * 100}%`;
  const rightPercent = `${(1 - splitFraction) * 100}%`;

  return (
    <div
      className="app"
      data-dark={dark}
      style={
        {
          "--app-bg": colors.bg,
          "--app-fg": colors.fg,
        } as React.CSSProperties
      }
    >
      <Toolbar themeName={themeName} onThemeChange={setThemeName} svg={svg} />
      <div
        className="split-pane"
        ref={splitRef}
        style={{
          gridTemplateColumns: `${leftPercent} 0px ${rightPercent}`,
        }}
      >
        <Editor code={code} onChange={setCode} themeName={themeName} />
        <div
          className="split-handle"
          onPointerDown={handleSplitPointerDown}
          onDoubleClick={() => setSplitFraction(0.5)}
        />
        <Preview svg={svg} error={error} bg={colors.bg} />
      </div>
    </div>
  );
}
