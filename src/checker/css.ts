import type { CheckIssue } from "./types";

const RAW_COLOR = /(^|[^-\w])(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:white|black|red|blue|green|gray|grey)\b(?=\s*[;!)]))/i;
const PHYSICAL =
  /^\s*(margin-(left|right)|padding-(left|right)|border-(left|right)(-\w+)?|left|right|float\s*:\s*(left|right)|text-align\s*:\s*(left|right))\s*:/;

/**
 * Static rules for component stylesheets:
 *  - colours come from theme variables only, or dark mode and themes break;
 *  - spacing and position use logical properties, or RTL stores break.
 * `rgb(0 0 0 / x)` shadows are allowed in the theme file, never in components.
 */
export function checkStylesheet(file: string, css: string): CheckIssue[] {
  const issues: CheckIssue[] = [];
  const lines = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " ")).split("\n");
  lines.forEach((line, index) => {
    const where = `${file}:${index + 1}`;
    const declaration = line.includes(":") && !line.trim().startsWith("@") && !/[{,]\s*$/.test(line);
    if (!declaration) return;
    if (RAW_COLOR.test(line.split(":").slice(1).join(":"))) {
      issues.push({ severity: "error", rule: "style.raw-color", where, message: `Use a theme variable instead of a raw colour: ${line.trim()}` });
    }
    if (PHYSICAL.test(line)) {
      issues.push({ severity: "error", rule: "style.physical-property", where, message: `Use a logical property (inline-start/end) so RTL works: ${line.trim()}` });
    }
  });
  return issues;
}
