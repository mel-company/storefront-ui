/**
 * `npm run registry [outDir]`: writes the copy-in registry that
 * `npx storefront-ui add` reads, plus the full catalogue.json/.md. Default out
 * dir: site/public/r, so the docs site serves it at /r/<id>.json.
 *
 * One JSON file per component and section, holding every source file it needs
 * (its own folder plus the shared files it imports, followed transitively),
 * with imports of the core rewritten to the package. Paths keep the repo's
 * layout (`sections/HeroSplit/…`, `components/Button/…`), so relative imports
 * between copied files stay valid.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { buildCatalogue, catalogueSummary } from "../src/catalogue";
import * as core from "../src/package";
import { builtInRegistry } from "../src/registry";

const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");
const PACKAGE = "@mel-company/storefront-ui";
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const out = resolve(ROOT, process.argv[2] ?? "site/public/r");

/** Folders and files that are the package, not copied. Imports into them are rewritten. */
const CORE = ["core", "theme", "store", "i18n", "icons", "pages", "utils.ts", "catalogue.ts"];
const DEMO = "demo";
/** Bare imports every copy already has: React and the package's own dependencies. */
const PROVIDED = new Set(["react", "react-dom", "zod", PACKAGE]);

export interface RegistryFile {
  path: string;
  content: string;
}

export interface RegistryItem {
  id: string;
  kind: "component" | "section";
  name: string;
  description: string;
  /** The package version these files were written against. */
  coreVersion: string;
  /** npm packages to install, `name@range`. */
  dependencies: string[];
  files: RegistryFile[];
}

const IMPORT = /(?:import|export)\s+(?:type\s+)?(?:[^"';]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

const isFile = (path: string) => existsSync(path) && statSync(path).isFile();

function resolveLocal(from: string, specifier: string): string {
  const base = resolve(dirname(from), specifier);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (isFile(candidate)) return candidate;
  }
  throw new Error(`${relative(ROOT, from)}: cannot resolve "${specifier}"`);
}

const topOf = (path: string) => relative(SRC, path).split("/")[0] ?? "";

/** Where an import into the core goes in a copy, or null for a file that is copied too. */
function packageSpecifier(path: string): string | null {
  const top = topOf(path);
  if (top === DEMO) return `${PACKAGE}/demo`;
  if (CORE.includes(top)) return PACKAGE;
  if (top === "components" || top === "sections") return null;
  throw new Error(`${relative(ROOT, path)} is neither core nor copyable`);
}

const valueNames = (clause: string) =>
  (clause.match(/\{([^}]*)\}/)?.[1] ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith("type "))
    .map((part) => part.split(/\s+as\s+/)[0] ?? part);

/** Rewrites one file's core imports and returns the local files it needs. */
function rewrite(path: string, coreExports: Set<string>): { content: string; local: string[]; npm: string[] } {
  const local: string[] = [];
  const npm: string[] = [];
  const content = readFileSync(path, "utf8").replace(IMPORT, (statement: string, fromSpec?: string, dynamicSpec?: string) => {
    const specifier = fromSpec ?? dynamicSpec ?? "";
    if (!specifier.startsWith(".")) {
      const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : (specifier.split("/")[0] ?? specifier);
      if (!PROVIDED.has(name)) npm.push(name);
      return statement;
    }
    const target = resolveLocal(path, specifier);
    const rewritten = packageSpecifier(target);
    if (rewritten === null) {
      local.push(target);
      return statement;
    }
    if (rewritten === PACKAGE && !/^(?:import|export)\s+type\b/.test(statement)) {
      for (const name of valueNames(statement)) {
        if (!coreExports.has(name)) throw new Error(`${relative(ROOT, path)}: "${name}" is not exported by ${PACKAGE}`);
      }
    }
    return statement.replace(specifier, rewritten);
  });
  return { content, local, npm };
}

function collect(entry: string[], coreExports: Set<string>) {
  const files = new Map<string, string>();
  const npm = new Set<string>();
  const queue = [...entry];
  while (queue.length) {
    const path = queue.shift()!;
    if (files.has(path)) continue;
    if (!path.match(/\.(tsx?|css)$/)) continue;
    if (path.endsWith(".css")) {
      files.set(path, readFileSync(path, "utf8"));
      continue;
    }
    const { content, local, npm: packages } = rewrite(path, coreExports);
    files.set(path, content);
    packages.forEach((name) => npm.add(name));
    queue.push(...local);
  }
  return { files, npm };
}

const definitionFolder = (kind: "components" | "sections", id: string) => {
  for (const folder of readdirSync(join(SRC, kind))) {
    const definition = join(SRC, kind, folder, "definition.tsx");
    if (isFile(definition) && readFileSync(definition, "utf8").includes(`id: "${id}"`)) return join(SRC, kind, folder);
  }
  throw new Error(`No folder for ${id}`);
};

const ownFiles = (folder: string) =>
  readdirSync(folder)
    .filter((name) => !/\.test\.tsx?$/.test(name))
    .map((name) => join(folder, name))
    .filter(isFile);

function build() {
  const coreExports = new Set(Object.keys(core));
  const deps: Record<string, string> = { ...pkg.devDependencies, ...pkg.dependencies };
  const items: RegistryItem[] = [];
  const definitions = [
    ...[...builtInRegistry.components.values()].map((d) => ({ d, kind: "components" as const })),
    ...[...builtInRegistry.sections.values()].map((d) => ({ d, kind: "sections" as const })),
  ];
  for (const { d, kind } of definitions) {
    const { files, npm } = collect(ownFiles(definitionFolder(kind, d.id)), coreExports);
    items.push({
      id: d.id,
      kind: d.kind as RegistryItem["kind"],
      name: d.name,
      description: d.description,
      coreVersion: pkg.version,
      dependencies: [...npm].sort().map((name) => (deps[name] ? `${name}@${deps[name]}` : name)),
      files: [...files.entries()]
        .map(([path, content]) => ({ path: relative(SRC, path), content }))
        .sort((a, b) => a.path.localeCompare(b.path)),
    });
  }
  return items;
}

const items = build();
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const item of items) writeFileSync(join(out, `${item.id}.json`), JSON.stringify(item, null, 2));
writeFileSync(
  join(out, "index.json"),
  JSON.stringify(
    {
      version: pkg.version,
      items: items.map(({ id, kind, name, description, dependencies, files }) => ({
        id,
        kind,
        name,
        description,
        dependencies,
        files: files.length,
        bytes: files.reduce((sum, file) => sum + Buffer.byteLength(file.content), 0),
      })),
    },
    null,
    2,
  ),
);
// The whole catalogue, for choosing what to add. A project builds its own from what it copied.
writeFileSync(join(out, "catalogue.json"), JSON.stringify(buildCatalogue(builtInRegistry, pkg.version), null, 2));
writeFileSync(join(out, "catalogue.md"), catalogueSummary(builtInRegistry));
console.log(`registry: ${items.length} items → ${relative(ROOT, out)}`);
