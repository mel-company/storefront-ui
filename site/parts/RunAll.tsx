import { useState } from "react";
import { builtInRegistry, checkComponent, checkPageDefinition, checkSection, checkTheme, themes, type CheckReport } from "../../src";
import { useSettings } from "../settings";

/** Runs every checker in the browser and shows the totals. */
export function RunAll() {
  const { theme } = useSettings();
  const [reports, setReports] = useState<CheckReport[] | null>(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    // Let the button repaint before the work starts.
    window.setTimeout(() => {
      const all = [
        ...Object.values(themes).map((item) => checkTheme(item)),
        ...[...builtInRegistry.components.values()].map((item) => checkComponent(item, { theme })),
        ...[...builtInRegistry.sections.values()].map((item) => checkSection(item, { theme })),
        ...[...builtInRegistry.pages.values()].map((item) => checkPageDefinition(item, { theme })),
      ];
      setReports(all);
      setRunning(false);
    }, 30);
  };

  const failed = reports?.filter((report) => !report.ok) ?? [];
  const checks = reports?.reduce((sum, report) => sum + report.checks, 0) ?? 0;

  return (
    <div className="glass run-all">
      <div>
        <h3>Run every check</h3>
        <p className="muted small">Themes, components, sections and pages, with the {theme.name} theme, right here in your browser.</p>
      </div>
      <button type="button" className="btn btn-primary" onClick={run} disabled={running}>
        {running ? "Checking…" : reports ? "Run again" : "Run all checks"}
      </button>
      {reports && (
        <p className={failed.length ? "fail" : "pass"} aria-live="polite">
          {failed.length
            ? `${failed.length} of ${reports.length} failed: ${failed.map((report) => report.target).join(", ")}`
            : `${reports.length} reports, ${checks.toLocaleString()} checks, all passed.`}
        </p>
      )}
    </div>
  );
}
