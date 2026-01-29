import { themeNames } from "../lib/themes";

interface ThemeSelectorProps {
  value: string;
  onChange: (theme: string) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <select
      className="theme-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {themeNames.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
