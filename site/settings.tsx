import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { themes, useSystemColorMode, type ColorMode, type ColorModePreference, type Direction, type Theme, type ThemeId } from "../src";

interface Settings {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  preference: ColorModePreference;
  setPreference: (mode: ColorModePreference) => void;
  mode: ColorMode;
  dir: Direction;
  setDir: (dir: Direction) => void;
  theme: Theme;
}

const SettingsContext = createContext<Settings | null>(null);

const read = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode: settings just do not persist.
  }
};

/** The gallery's global controls: theme preset, colour mode and direction. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const ids = Object.keys(themes) as ThemeId[];
  const [themeId, setThemeIdState] = useState<ThemeId>(() => read("sfui.theme", ids, "porcelain"));
  const [preference, setPreferenceState] = useState<ColorModePreference>(() => read("sfui.mode", ["light", "dark", "system"] as const, "system"));
  const [dir, setDirState] = useState<Direction>(() => read("sfui.dir", ["ltr", "rtl"] as const, "ltr"));
  const system = useSystemColorMode();
  const mode = preference === "system" ? system : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo<Settings>(
    () => ({
      themeId,
      setThemeId: (id) => {
        setThemeIdState(id);
        write("sfui.theme", id);
      },
      preference,
      setPreference: (next) => {
        setPreferenceState(next);
        write("sfui.mode", next);
      },
      mode,
      dir,
      setDir: (next) => {
        setDirState(next);
        write("sfui.dir", next);
      },
      theme: themes[themeId],
    }),
    [themeId, preference, mode, dir],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings outside SettingsProvider");
  return value;
}
