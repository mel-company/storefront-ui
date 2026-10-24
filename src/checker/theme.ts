import { contrastRatio } from "../theme/color";
import { themeSchema, type ColorMode, type Palette } from "../theme/schema";
import { toReport, type CheckIssue, type CheckReport, type Severity } from "./types";

interface ContrastRule {
  rule: string;
  fg: keyof Palette;
  bg: keyof Palette;
  min: number;
  severity: Severity;
  why: string;
}

/**
 * The colour pairs components actually draw. 4.5 is WCAG AA for body text,
 * 3 is AA for large text and for UI parts (buttons, focus rings, badges).
 */
export const CONTRAST_RULES: ContrastRule[] = [
  { rule: "text-on-background", fg: "text", bg: "background", min: 4.5, severity: "error", why: "body text" },
  { rule: "text-on-surface", fg: "text", bg: "surface", min: 4.5, severity: "error", why: "text in cards" },
  { rule: "text-on-surface-muted", fg: "text", bg: "surfaceMuted", min: 4.5, severity: "error", why: "text in bands" },
  { rule: "muted-on-background", fg: "textMuted", bg: "background", min: 4.5, severity: "error", why: "secondary text" },
  { rule: "muted-on-surface", fg: "textMuted", bg: "surface", min: 4.5, severity: "error", why: "secondary text in cards" },
  { rule: "accent-text-on-accent", fg: "accentText", bg: "accent", min: 4.5, severity: "error", why: "button labels" },
  { rule: "accent-on-background", fg: "accent", bg: "background", min: 3, severity: "error", why: "links and outlines" },
  { rule: "accent-on-surface", fg: "accent", bg: "surface", min: 3, severity: "error", why: "accents in cards" },
  { rule: "focus-on-background", fg: "focus", bg: "background", min: 3, severity: "error", why: "keyboard focus ring" },
  { rule: "danger-on-surface", fg: "danger", bg: "surface", min: 4.5, severity: "error", why: "sale prices and errors" },
  { rule: "success-on-surface", fg: "success", bg: "surface", min: 3, severity: "error", why: "stock badges" },
  { rule: "warning-on-surface", fg: "warning", bg: "surface", min: 3, severity: "error", why: "low stock notes" },
  { rule: "border-on-background", fg: "border", bg: "background", min: 1.15, severity: "warning", why: "hairlines visible" },
];

const MODES: ColorMode[] = ["light", "dark"];

/**
 * The global theme checker. Validates the shape, then every colour pair a
 * component draws, in light and in dark mode, and checks that dark mode is
 * really dark.
 */
export function checkTheme(input: unknown): CheckReport {
  const parsed = themeSchema.safeParse(input);
  const id =
    typeof input === "object" && input && "id" in input ? String((input as { id: unknown }).id) : "theme";
  if (!parsed.success) {
    const issues = parsed.error.issues.map<CheckIssue>((issue) => ({
      severity: "error",
      rule: "schema",
      message: `${issue.path.join(".") || "theme"}: ${issue.message}`,
    }));
    return toReport(id, "theme", issues, 1);
  }

  const theme = parsed.data;
  const issues: CheckIssue[] = [];
  let checks = 1;

  for (const mode of MODES) {
    const palette = theme.colors[mode];
    for (const rule of CONTRAST_RULES) {
      checks += 1;
      const ratio = contrastRatio(palette[rule.fg], palette[rule.bg]);
      if (ratio < rule.min) {
        issues.push({
          severity: rule.severity,
          rule: `contrast.${rule.rule}`,
          where: mode,
          message: `${rule.fg} ${palette[rule.fg]} on ${rule.bg} ${palette[rule.bg]} is ${ratio.toFixed(2)}:1, needs ${rule.min}:1 (${rule.why})`,
        });
      }
    }
  }

  checks += 1;
  const lightBg = theme.colors.light.background;
  const darkBg = theme.colors.dark.background;
  if (contrastRatio(darkBg, "#000000") > contrastRatio(lightBg, "#000000")) {
    issues.push({
      severity: "error",
      rule: "mode.dark-is-darker",
      message: `dark background ${darkBg} is lighter than light background ${lightBg}`,
    });
  }

  return toReport(theme.id, "theme", issues, checks);
}

/** Contrast numbers for display, e.g. the gallery's theme panel. */
export function contrastTable(palette: Palette) {
  return CONTRAST_RULES.map((rule) => {
    const ratio = contrastRatio(palette[rule.fg], palette[rule.bg]);
    return { ...rule, ratio, pass: ratio >= rule.min };
  });
}
