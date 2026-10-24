import { useEffect, useRef, useState } from "react";
import { builtInRegistry, checkComponent, checkPageDefinition, checkSection, checkTheme, themes, type CheckReport } from "../../src";
import { useSettings } from "../settings";

interface Job {
  key: string;
  kind: string;
  id: string;
  run: () => CheckReport;
}

const COMMAND = "npm run check";

/** Every checker in the browser, one row per target, filled in as each finishes. */
export function Checker() {
  const { theme } = useSettings();
  const [results, setResults] = useState<Record<string, CheckReport>>({});
  const [running, setRunning] = useState(false);
  const timer = useRef<number>();

  const jobs: Job[] = [
    ...Object.values(themes).map((item) => ({ key: `theme:${item.id}`, kind: "theme", id: item.id, run: () => checkTheme(item) })),
    ...[...builtInRegistry.components.values()].map((item) => ({ key: `component:${item.id}`, kind: "component", id: item.id, run: () => checkComponent(item, { theme }) })),
    ...[...builtInRegistry.sections.values()].map((item) => ({ key: `section:${item.id}`, kind: "section", id: item.id, run: () => checkSection(item, { theme }) })),
    ...[...builtInRegistry.pages.values()].map((item) => ({ key: `page:${item.id}`, kind: "page", id: item.id, run: () => checkPageDefinition(item, { theme }) })),
  ];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const run = () => {
    window.clearTimeout(timer.current);
    setResults({});
    setRunning(true);
    let index = 0;
    const step = () => {
      const job = jobs[index];
      if (!job) {
        setRunning(false);
        return;
      }
      const report = job.run();
      setResults((current) => ({ ...current, [job.key]: report }));
      index += 1;
      timer.current = window.setTimeout(step, 0);
    };
    timer.current = window.setTimeout(step, 0);
  };

  const done = Object.values(results);
  const failed = done.filter((report) => !report.ok).length;
  const checks = done.reduce((sum, report) => sum + report.checks, 0);

  return (
    <section className="block" id="checker" aria-labelledby="checker-title">
      <div className="container">
        <header className="block-head">
          <h2 id="checker-title">Checker</h2>
          <p className="muted">
            The same checks as <code>{COMMAND}</code> in CI: theme contrast, schema and examples, render in four variants, accessible
            names, links, images, ids, landmarks and one h1 per page. Runs with the {theme.name} theme.
          </p>
        </header>
        <div className="table-wrap">
          <div className="table-bar">
            <span aria-live="polite">
              {done.length === 0
                ? `${jobs.length} targets`
                : `${done.length} / ${jobs.length} · ${checks.toLocaleString()} checks · ${failed ? `${failed} failed` : "0 failed"}`}
            </span>
            <button type="button" className="btn btn-primary btn-sm" onClick={run} disabled={running}>
              {running ? "Running…" : done.length ? "Run again" : "Run all checks"}
            </button>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Target</th>
                  <th scope="col">Kind</th>
                  <th scope="col" className="num">
                    Checks
                  </th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const report = results[job.key];
                  const errors = report?.issues.filter((issue) => issue.severity === "error") ?? [];
                  return (
                    <tr key={job.key}>
                      <td>
                        <code>{job.id}</code>
                      </td>
                      <td className="muted">{job.kind}</td>
                      <td className="num">{report ? report.checks : ""}</td>
                      <td>
                        {!report ? (
                          <span className="muted">–</span>
                        ) : report.ok ? (
                          <span className="pass">pass</span>
                        ) : (
                          <span className="fail" title={errors.map((issue) => issue.message).join("\n")}>
                            {errors.length} {errors.length === 1 ? "error" : "errors"}: {errors[0]?.rule}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
