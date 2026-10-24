/**
 * `npm run check`: the global theme checker, then every component, section and
 * page, then the stylesheets. Exits 1 on any error, so CI can gate on it.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { JSDOM } from "jsdom";
import {
  builtInRegistry,
  checkComponent,
  checkPageDefinition,
  checkSection,
  checkStylesheet,
  checkTheme,
  themes,
  type CheckReport,
} from "../src";

const parse = (html: string) => new JSDOM(html).window.document;
const root = new URL("..", import.meta.url).pathname;

const reports: CheckReport[] = [];
const cssIssues: ReturnType<typeof checkStylesheet> = [];

for (const theme of Object.values(themes)) reports.push(checkTheme(theme));
for (const definition of builtInRegistry.components.values()) reports.push(checkComponent(definition, { parse }));
for (const definition of builtInRegistry.sections.values()) reports.push(checkSection(definition, { parse }));
for (const definition of builtInRegistry.pages.values()) {
  for (const theme of Object.values(themes)) {
    const report = checkPageDefinition(definition, { parse, theme });
    reports.push({ ...report, target: `${definition.id} (${theme.id})` });
  }
}

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : path.endsWith(".module.css") ? [path] : [];
  });
for (const file of walk(join(root, "src"))) cssIssues.push(...checkStylesheet(relative(root, file), readFileSync(file, "utf8")));

const color = (code: number, text: string) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);
let errors = 0;
let warnings = 0;
let checks = 0;

for (const report of reports) {
  checks += report.checks;
  const mark = report.ok ? color(32, "✓") : color(31, "✗");
  console.log(`${mark} ${report.kind.padEnd(9)} ${report.target} ${color(90, `(${report.checks} checks)`)}`);
  for (const issue of report.issues) {
    if (issue.severity === "error") errors += 1;
    else warnings += 1;
    const tag = issue.severity === "error" ? color(31, "error") : color(33, "warn ");
    console.log(`    ${tag} ${issue.rule}${issue.where ? ` [${issue.where}]` : ""}: ${issue.message}`);
  }
}

const cssFiles = walk(join(root, "src")).length;
console.log(`${cssIssues.length ? color(31, "✗") : color(32, "✓")} styles    ${cssFiles} stylesheets`);
for (const issue of cssIssues) {
  errors += 1;
  console.log(`    ${color(31, "error")} ${issue.rule} [${issue.where}]: ${issue.message}`);
}

console.log(`\n${reports.length} reports, ${checks} checks, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
