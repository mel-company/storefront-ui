import type { CSSProperties } from "react";
import type { ColorMode, Palette, Theme } from "./schema";

const RADIUS: Record<Theme["radius"], [string, string, string]> = {
  none: ["0px", "0px", "0px"],
  soft: ["4px", "6px", "10px"],
  round: ["8px", "12px", "20px"],
  pill: ["10px", "16px", "28px"],
};

const SPACE_UNIT: Record<Theme["density"], number> = {
  compact: 3.5,
  normal: 4,
  spacious: 5,
};

const TYPE_RATIO: Record<Theme["typeScale"], number> = {
  tight: 1.18,
  normal: 1.25,
  large: 1.32,
};

const DURATION: Record<Theme["motion"], string> = {
  none: "0ms",
  subtle: "160ms",
  lively: "260ms",
};

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Every CSS custom property a theme sets. Components read only these. */
export function themeToCssVars(theme: Theme, mode: ColorMode): CSSProperties {
  const palette: Palette = theme.colors[mode];
  const vars: Record<string, string> = {};

  for (const [role, value] of Object.entries(palette)) {
    vars[`--msu-${kebab(role)}`] = value;
  }

  const [sm, md, lg] = RADIUS[theme.radius];
  vars["--msu-radius-sm"] = sm;
  vars["--msu-radius-md"] = md;
  vars["--msu-radius-lg"] = lg;
  vars["--msu-radius-full"] = theme.radius === "none" ? "0px" : "999px";

  const unit = SPACE_UNIT[theme.density];
  [1, 2, 3, 4, 6, 8, 12, 16, 24].forEach((step) => {
    vars[`--msu-space-${step}`] = `${step * unit}px`;
  });

  const ratio = TYPE_RATIO[theme.typeScale];
  const steps = { xs: -2, sm: -1, md: 0, lg: 1, xl: 2, "2xl": 3, "3xl": 4, "4xl": 5 };
  for (const [name, step] of Object.entries(steps)) {
    vars[`--msu-text-${name}`] = `${(16 * ratio ** step / 16).toFixed(3)}rem`;
  }

  vars["--msu-font-heading"] = theme.fonts.heading;
  vars["--msu-font-body"] = theme.fonts.body;
  vars["--msu-duration"] = DURATION[theme.motion];

  vars["--msu-card-border"] =
    theme.surface === "bordered" ? `1px solid ${palette.border}` : "1px solid transparent";
  vars["--msu-card-shadow"] =
    theme.surface === "raised"
      ? mode === "dark"
        ? "0 1px 2px rgb(0 0 0 / 0.5), 0 8px 24px rgb(0 0 0 / 0.35)"
        : "0 1px 2px rgb(16 24 40 / 0.06), 0 8px 24px rgb(16 24 40 / 0.08)"
      : "none";

  // Behind drawers and dialogs. Text and background colours can't dim in both modes, so this one is fixed.
  vars["--msu-scrim"] = mode === "dark" ? "rgb(0 0 0 / 0.6)" : "rgb(16 24 40 / 0.4)";
  // Copy set straight on a photo: always a dark shade with light text, whatever the mode.
  vars["--msu-shade"] = "rgb(10 12 18)";
  vars["--msu-on-shade"] = "rgb(255 255 255)";

  return vars as CSSProperties;
}
