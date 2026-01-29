import { useState } from "react";
import { Toolbar } from "./components/Toolbar";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import { useDebouncedRender } from "./hooks/useDebouncedRender";
import { getThemeColors, isColorDark } from "./lib/themes";
import { DEFAULT_DIAGRAM, DEFAULT_THEME } from "./lib/defaults";

export function App() {
  const [code, setCode] = useState(DEFAULT_DIAGRAM);
  const [themeName, setThemeName] = useState(DEFAULT_THEME);
  const { svg, error } = useDebouncedRender(code, themeName);

  const colors = getThemeColors(themeName);
  const dark = isColorDark(colors.bg);

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
      <div className="split-pane">
        <Editor code={code} onChange={setCode} themeName={themeName} />
        <Preview svg={svg} error={error} bg={colors.bg} />
      </div>
    </div>
  );
}
