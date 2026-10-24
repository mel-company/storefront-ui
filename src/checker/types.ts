export type Severity = "error" | "warning";

export interface CheckIssue {
  severity: Severity;
  /** Stable rule id, e.g. `contrast.text-on-surface` or `a11y.button-name`. */
  rule: string;
  message: string;
  /** Where it happened: an example name, a colour mode, a section index. */
  where?: string;
}

export interface CheckReport {
  /** The theme, component, section or page id that was checked. */
  target: string;
  kind: "theme" | "component" | "section" | "page" | "composition";
  ok: boolean;
  issues: CheckIssue[];
  /** How many individual checks ran, so a pass means something. */
  checks: number;
}

export const toReport = (
  target: string,
  kind: CheckReport["kind"],
  issues: CheckIssue[],
  checks: number,
): CheckReport => ({
  target,
  kind,
  ok: !issues.some((issue) => issue.severity === "error"),
  issues,
  checks,
});
