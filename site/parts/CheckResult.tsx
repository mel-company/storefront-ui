import type { CheckReport } from "../../src";

export function CheckBadge({ report }: { report: CheckReport | null }) {
  if (!report) return <span className="badge badge-idle">Not run</span>;
  const errors = report.issues.filter((issue) => issue.severity === "error").length;
  const warnings = report.issues.length - errors;
  if (errors) return <span className="badge badge-fail">{errors} {errors === 1 ? "error" : "errors"}</span>;
  if (warnings) return <span className="badge badge-warn">{warnings} warnings</span>;
  return <span className="badge badge-pass">Passed · {report.checks} checks</span>;
}

export function CheckIssues({ report }: { report: CheckReport }) {
  if (report.issues.length === 0) {
    return (
      <p className="muted small">
        Every check passed: schema, examples, render in light, dark, LTR and RTL, accessible names, labels, links, images, ids and
        theme-only colours.
      </p>
    );
  }
  return (
    <ul className="issues">
      {report.issues.map((issue, index) => (
        <li key={`${issue.rule}-${index}`} className={issue.severity}>
          <strong>{issue.rule}</strong>
          {issue.where && <span className="muted"> · {issue.where}</span>}
          <span>{issue.message}</span>
        </li>
      ))}
    </ul>
  );
}
