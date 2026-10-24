import { themes, type ColorModePreference, type ThemeId } from "../../src";
import { useSettings } from "../settings";

const MODES: { value: ColorModePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Auto" },
];

/** Theme, mode and direction switches. They drive the site and every preview. */
export function Controls() {
  const { themeId, setThemeId, preference, setPreference, dir, setDir } = useSettings();
  return (
    <div className="controls">
      <label className="select-wrap">
        <span className="sr-only">Theme</span>
        <select value={themeId} onChange={(event) => setThemeId(event.target.value as ThemeId)}>
          {Object.values(themes).map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </label>
      <div className="segmented" role="group" aria-label="Colour mode">
        {MODES.map((mode) => (
          <button key={mode.value} type="button" aria-pressed={preference === mode.value} onClick={() => setPreference(mode.value)}>
            {mode.label}
          </button>
        ))}
      </div>
      <div className="segmented" role="group" aria-label="Text direction">
        {(["ltr", "rtl"] as const).map((value) => (
          <button key={value} type="button" aria-pressed={dir === value} onClick={() => setDir(value)}>
            {value.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
