import { THEMES, type DiagramColors } from "beautiful-mermaid";
import type { Extension } from "@codemirror/state";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { nord } from "@uiw/codemirror-theme-nord";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import {
  solarizedLight,
  solarizedDark,
} from "@uiw/codemirror-theme-solarized";

const editorThemeMap: Record<string, Extension> = {
  "zinc-dark": tokyoNight,
  "tokyo-night": tokyoNight,
  "tokyo-night-storm": tokyoNightStorm,
  "tokyo-night-light": githubLight,
  "catppuccin-mocha": dracula,
  "catppuccin-latte": githubLight,
  "nord": nord,
  "nord-light": githubLight,
  "dracula": dracula,
  "github-light": githubLight,
  "github-dark": githubDark,
  "solarized-light": solarizedLight,
  "solarized-dark": solarizedDark,
  "one-dark": tokyoNight,
};

export function resolveEditorTheme(themeName: string): Extension {
  return editorThemeMap[themeName] ?? tokyoNight;
}

export function isColorDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Relative luminance approximation
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

export function getThemeColors(themeName: string): DiagramColors {
  return THEMES[themeName] ?? { bg: "#1a1b26", fg: "#a9b1d6" };
}

export const themeNames = Object.keys(THEMES);
