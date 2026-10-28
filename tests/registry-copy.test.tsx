/**
 * The copy-in path end to end: build the registry, run `storefront-ui add`
 * for every section into a scratch folder, then render each copied section's
 * examples and compare with the library's own. Class names are left out of
 * the comparison: CSS module hashes follow the file path, which differs.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Registry, SectionDefinition } from "../src/core";
import { exampleElement, toHtml } from "../src/checker/render";
import { builtInRegistry } from "../src/registry";

const ROOT = resolve(__dirname, "..");
const SCRATCH = join(ROOT, "node_modules/.registry-check");
const REGISTRY = join(SCRATCH, "r");
const APP = join(SCRATCH, "app");
const sectionIds = [...builtInRegistry.sections.keys()];

let copied: Registry;

beforeAll(async () => {
  rmSync(SCRATCH, { recursive: true, force: true });
  mkdirSync(APP, { recursive: true });
  execFileSync("npx", ["vite-node", "scripts/registry.ts", REGISTRY], { cwd: ROOT, stdio: "pipe" });
  execFileSync("node", [join(ROOT, "bin/storefront-ui.mjs"), "add", ...sectionIds, "--registry", REGISTRY, "--dir", "ui"], { cwd: APP, stdio: "pipe" });
  copied = (await import(/* @vite-ignore */ join(APP, "ui/registry.ts"))).registry;
}, 120_000);

const withoutClasses = (html: string) => html.replace(/ class="[^"]*"/g, "");

describe("storefront-ui add", () => {
  it("copies every section and lists it in registry.ts", () => {
    expect([...copied.sections.keys()].sort()).toEqual([...sectionIds].sort());
    expect(readFileSync(join(APP, "storefront-ui.json"), "utf8")).toContain('"dir": "ui"');
  });

  it("points copied files at the package, never back into the library", () => {
    const source = readFileSync(join(APP, "ui/sections/HeroSplit/definition.tsx"), "utf8");
    expect(source).toContain('from "@mel-company/storefront-ui"');
    expect(source).toContain('from "@mel-company/storefront-ui/demo"');
    expect(source).not.toMatch(/from "\.\.\/\.\.\/(core|demo|theme|store)/);
  });

  it.each(sectionIds)("%s renders the same as the library's", (id) => {
    const original = builtInRegistry.sections.get(id)!;
    const copy = copied.sections.get(id) as SectionDefinition;
    original.examples.forEach((example, index) => {
      for (const options of [{}, { dir: "rtl" as const }, { skeleton: true }]) {
        const expected = withoutClasses(toHtml(exampleElement(original, example, options)));
        const actual = withoutClasses(toHtml(exampleElement(copy, copy.examples[index]!, { ...options, registry: copied })));
        expect(actual).toBe(expected);
      }
    });
  });

  it("keeps a file the project changed unless --overwrite", () => {
    const file = join(APP, "ui/sections/HeroSplit/HeroSplit.tsx");
    const edited = `${readFileSync(file, "utf8")}\n// edited\n`;
    writeFileSync(file, edited);
    const run = (...extra: string[]) =>
      execFileSync("node", [join(ROOT, "bin/storefront-ui.mjs"), "add", "hero.split", "--registry", REGISTRY, ...extra], { cwd: APP, encoding: "utf8" });
    expect(run()).toContain("Kept 1 file(s) you changed");
    expect(readFileSync(file, "utf8")).toBe(edited);
    run("--overwrite");
    expect(readFileSync(file, "utf8")).not.toContain("// edited");
  });
});
