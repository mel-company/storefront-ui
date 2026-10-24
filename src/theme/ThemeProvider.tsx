import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { themeToCssVars } from "./css-vars";
import { defaultTheme } from "./presets";
import type { ColorMode, ColorModePreference, Direction, Theme } from "./schema";
import "./base.css";

interface ThemeContextValue {
  theme: Theme;
  mode: ColorMode;
  preference: ColorModePreference;
  dir: Direction;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeToSystemMode(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSystemMode = (): ColorMode =>
  typeof window !== "undefined" && window.matchMedia?.(DARK_QUERY).matches ? "dark" : "light";

/** Follows the operating system's colour scheme, and re-renders when it changes. */
export function useSystemColorMode(): ColorMode {
  return useSyncExternalStore(subscribeToSystemMode, getSystemMode, () => "light");
}

export interface ThemeProviderProps {
  theme?: Theme;
  /** `system` follows the visitor's device setting. */
  mode?: ColorModePreference;
  dir?: Direction;
  className?: string;
  children: ReactNode;
}

/**
 * Scopes a theme to its subtree. Several providers can sit on one page (the
 * gallery renders one per preview), so variables are set on a wrapper, never
 * on `:root`.
 */
export function ThemeProvider({
  theme = defaultTheme,
  mode: preference = "system",
  dir = "ltr",
  className,
  children,
}: ThemeProviderProps) {
  const systemMode = useSystemColorMode();
  const mode = preference === "system" ? systemMode : preference;
  const style = useMemo(() => themeToCssVars(theme, mode), [theme, mode]);
  const value = useMemo(
    () => ({ theme, mode, preference, dir }),
    [theme, mode, preference, dir],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={className ? `msu-root ${className}` : "msu-root"}
        data-msu-mode={mode}
        dir={dir}
        style={style}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}
