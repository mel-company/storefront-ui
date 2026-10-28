#!/usr/bin/env node
/**
 * storefront-ui: copies components and sections into a project as source.
 *
 *   npx storefront-ui list
 *   npx storefront-ui add hero.split products.grid
 *
 * Files land in `dir` (default src/storefront-ui) with the library's layout,
 * so shared files are written once and relative imports keep working. Their
 * imports of the core point at the @mel-company/storefront-ui package. After
 * every add, `<dir>/registry.ts` and `<dir>/index.ts` are rewritten to list
 * what is there.
 *
 * Options: --dir <path>, --registry <url or folder>, --overwrite, --dry-run,
 * --js-extensions (write `./Button.js` rather than `./Button` in relative
 * imports, for code Node's ESM resolver loads). `dir`, `registry` and
 * `jsExtensions` are remembered in storefront-ui.json.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";

const DEFAULT_REGISTRY = "https://storefront-ui-x.vercel.app/r";
const CONFIG = "storefront-ui.json";
const PACKAGE = "@mel-company/storefront-ui";

function parse(argv) {
  const args = { _: [], overwrite: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--overwrite") args.overwrite = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--js-extensions") args.jsExtensions = true;
    else if (arg === "--dir" || arg === "--registry") args[arg.slice(2)] = argv[++i];
    else if (arg === "-h" || arg === "--help") args.help = true;
    else args._.push(arg);
  }
  return args;
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

async function load(registry, name) {
  if (/^https?:\/\//.test(registry)) {
    const response = await fetch(`${registry.replace(/\/$/, "")}/${name}`);
    if (!response.ok) throw new Error(`${name}: ${response.status} from ${registry}`);
    return response.json();
  }
  const path = join(resolve(registry), name);
  if (!existsSync(path)) throw new Error(`${name}: not found in ${registry}`);
  return readJson(path);
}

const ASSET = /\.(css|json|svg|png|jpe?g|webp)$/;
const RELATIVE = /((?:from|import)\s*\(?\s*["'])(\.\.?\/[^"']*)(["'])/g;

/** `./Button` → `./Button.js`, `../Button` (a folder) → `../Button/index.js`. */
function withJsExtensions(content, path, exists) {
  return content.replace(RELATIVE, (match, open, specifier, close) => {
    if (ASSET.test(specifier) || specifier.endsWith(".js")) return match;
    const base = posix.normalize(posix.join(posix.dirname(path), specifier));
    if (exists(`${base}.ts`) || exists(`${base}.tsx`)) return `${open}${specifier}.js${close}`;
    if (exists(`${base}/index.ts`) || exists(`${base}/index.tsx`)) return `${open}${specifier}/index.js${close}`;
    return match;
  });
}

/**
 * `registry.ts` from `export const fooDefinition = defineSection(` in every
 * copied definition file, and `index.ts` re-exporting each copied folder.
 */
function writeRegistryFile(dir, jsExtensions) {
  const ext = jsExtensions ? ".js" : "";
  const found = { components: [], sections: [] };
  const folders = [];
  for (const kind of ["components", "sections"]) {
    const root = join(dir, kind);
    if (!existsSync(root)) continue;
    for (const folder of readdirSync(root).sort()) {
      if (existsSync(join(root, folder, "index.ts"))) folders.push(`./${kind}/${folder}${jsExtensions ? "/index.js" : ""}`);
      const file = join(root, folder, "definition.tsx");
      if (!existsSync(file)) continue;
      const match = readFileSync(file, "utf8").match(/export const (\w+)\s*=\s*define(?:Component|Section)\(/);
      if (match) found[kind].push({ name: match[1], from: `./${kind}/${folder}/definition${ext}` });
    }
  }
  writeFileSync(
    join(dir, "index.ts"),
    ["// Written by `storefront-ui add`.", `export { registry } from "./registry${ext}";`, ...folders.map((from) => `export * from "${from}";`), ""].join("\n"),
  );
  const all = [...found.components, ...found.sections];
  const lines = [
    "// Written by `storefront-ui add`. Lists every component and section in this folder.",
    `import { createRegistry } from "${PACKAGE}";`,
    ...all.map(({ name, from }) => `import { ${name} } from "${from}";`),
    "",
    "export const registry = createRegistry({",
    `  components: [${found.components.map((d) => d.name).join(", ")}],`,
    `  sections: [${found.sections.map((d) => d.name).join(", ")}],`,
    "  pages: [],",
    "});",
    "",
  ];
  writeFileSync(join(dir, "registry.ts"), lines.join("\n"));
  return all.length;
}

function installedCoreVersion() {
  const path = resolve("node_modules", PACKAGE, "package.json");
  return existsSync(path) ? readJson(path).version : null;
}

const minor = (version) => version?.split(".").slice(0, 2).join(".");

function missingDependencies(dependencies) {
  const pkgPath = resolve("package.json");
  const pkg = existsSync(pkgPath) ? readJson(pkgPath) : {};
  const have = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  return [...dependencies].filter((spec) => {
    const name = spec.startsWith("@") ? spec.split("@").slice(0, 2).join("@") : spec.split("@")[0];
    return !have[name];
  });
}

async function add(ids, options) {
  if (!ids.length) throw new Error("Name at least one id, e.g. `storefront-ui add hero.split`. `storefront-ui list` shows them all.");
  const dir = resolve(options.dir);
  const items = await Promise.all(ids.map((id) => load(options.registry, `${id}.json`)));
  const incoming = new Set(items.flatMap((item) => item.files.map((file) => file.path)));
  const exists = (path) => incoming.has(path) || existsSync(join(dir, path));
  const contentOf = (file) =>
    options.jsExtensions && /\.tsx?$/.test(file.path) ? withJsExtensions(file.content, file.path, exists) : file.content;
  const written = [];
  const skipped = [];
  const dependencies = new Set();
  const seen = new Set();
  for (const item of items) {
    item.dependencies.forEach((dep) => dependencies.add(dep));
    for (const file of item.files) {
      if (seen.has(file.path)) continue;
      seen.add(file.path);
      const target = join(dir, file.path);
      const content = contentOf(file);
      if (existsSync(target)) {
        const current = readFileSync(target, "utf8");
        if (current === content) continue;
        // Copies are meant to be edited: never overwrite a change silently.
        if (!options.overwrite) {
          skipped.push(file.path);
          continue;
        }
      }
      written.push(file.path);
      if (options.dryRun) continue;
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
  }
  const total = options.dryRun ? null : writeRegistryFile(dir, options.jsExtensions);

  const where = relative(process.cwd(), dir) || ".";
  console.log(`${options.dryRun ? "Would write" : "Wrote"} ${written.length} file(s) to ${where}${total === null ? "" : `; registry.ts lists ${total} definition(s)`}.`);
  for (const path of written) console.log(`  + ${path}`);
  if (skipped.length) {
    console.log(`Kept ${skipped.length} file(s) you changed (pass --overwrite to replace them):`);
    for (const path of skipped) console.log(`  = ${path}`);
  }
  const core = installedCoreVersion();
  const wanted = items[0]?.coreVersion;
  if (!core) console.log(`\nInstall the core: npm install ${PACKAGE}@^${wanted}`);
  else if (wanted && minor(core) !== minor(wanted)) console.log(`\nThese files were written for ${PACKAGE} ${wanted}; you have ${core}.`);
  const missing = missingDependencies(dependencies);
  if (missing.length) console.log(`\nThey also need: npm install ${missing.join(" ")}`);
}

async function list(options) {
  const index = await load(options.registry, "index.json");
  for (const kind of ["section", "component"]) {
    console.log(`${kind}s`);
    for (const item of index.items.filter((entry) => entry.kind === kind)) {
      console.log(`  ${item.id.padEnd(26)} ${item.description}`);
    }
  }
}

async function main() {
  const args = parse(process.argv.slice(2));
  const [command, ...ids] = args._;
  if (args.help || !command) {
    console.log("Usage: storefront-ui <list | add <id...>> [--dir <path>] [--registry <url|folder>] [--overwrite] [--dry-run] [--js-extensions]");
    return;
  }
  const config = existsSync(CONFIG) ? readJson(CONFIG) : {};
  const options = {
    dir: args.dir ?? config.dir ?? "src/storefront-ui",
    registry: args.registry ?? config.registry ?? DEFAULT_REGISTRY,
    overwrite: args.overwrite,
    dryRun: args.dryRun,
    jsExtensions: Boolean(args.jsExtensions ?? config.jsExtensions),
  };
  if (command === "list") return list(options);
  if (command === "add") {
    await add(ids, options);
    const next = {
      ...config,
      dir: options.dir,
      ...(args.registry ? { registry: args.registry } : {}),
      ...(options.jsExtensions ? { jsExtensions: true } : {}),
    };
    if (!args.dryRun && JSON.stringify(next) !== JSON.stringify(config)) {
      writeFileSync(CONFIG, `${JSON.stringify(next, null, 2)}\n`);
    }
    return;
  }
  throw new Error(`Unknown command "${command}". Use list or add.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
