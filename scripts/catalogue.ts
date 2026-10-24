/** `npm run catalogue`: writes dist/catalogue.json and dist/catalogue.md for AI agents. */
import { mkdirSync, writeFileSync } from "node:fs";
import { buildCatalogue, catalogueSummary } from "../src/catalogue";

const pkg = await import("../package.json", { with: { type: "json" } });
const out = new URL("../dist/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const catalogue = buildCatalogue(undefined, pkg.default.version);
writeFileSync(`${out}catalogue.json`, JSON.stringify(catalogue, null, 2));
writeFileSync(`${out}catalogue.md`, catalogueSummary());
console.log(`catalogue: ${catalogue.components.length} components, ${catalogue.sections.length} sections, ${catalogue.pages.length} pages`);
