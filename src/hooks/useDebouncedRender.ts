import { useState, useEffect, useRef } from "react";
import { renderMermaid } from "beautiful-mermaid";
import { getThemeColors } from "../lib/themes";

interface RenderResult {
  svg: string;
  error: string | null;
}

export function useDebouncedRender(
  code: string,
  themeName: string
): RenderResult {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const renderIdRef = useRef(0);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      const id = ++renderIdRef.current;
      try {
        const colors = getThemeColors(themeName);
        const result = await renderMermaid(code, colors);
        if (id === renderIdRef.current) {
          setSvg(result);
          setError(null);
        }
      } catch (e) {
        if (id === renderIdRef.current) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [code, themeName]);

  return { svg, error };
}
