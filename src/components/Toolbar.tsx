import { ThemeSelector } from "./ThemeSelector";
import { ExportMenu } from "./ExportMenu";

interface ToolbarProps {
  themeName: string;
  onThemeChange: (theme: string) => void;
  svg: string;
}

export function Toolbar({ themeName, onThemeChange, svg }: ToolbarProps) {
  return (
    <div className="toolbar">
      <span className="toolbar-title">Mermaid Editor</span>
      <div className="toolbar-actions">
        <ThemeSelector value={themeName} onChange={onThemeChange} />
        <ExportMenu svg={svg} />
      </div>
    </div>
  );
}
