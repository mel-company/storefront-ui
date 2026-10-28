import { zodToJsonSchema } from "zod-to-json-schema";
import type { Registry } from "./core/registry";
import { themes } from "./theme/presets";
import { themeSchema } from "./theme/schema";
import { storeCompositionSchema } from "./pages/composition";

export interface CatalogueEntry {
  id: string;
  kind: "component" | "section";
  name: string;
  description: string;
  tags: string[];
  pages?: string[];
  placement?: string;
  uses?: string[];
  props: unknown;
  examples: { name: string; props: unknown }[];
}

export interface Catalogue {
  version: string;
  components: CatalogueEntry[];
  sections: CatalogueEntry[];
  pages: { id: string; name: string; description: string; pageType: string; requires: string[]; sections: unknown[] }[];
  themes: { presets: string[]; schema: unknown };
  compositionSchema: unknown;
  rules: string[];
}

const jsonSchema = (schema: Parameters<typeof zodToJsonSchema>[0]) =>
  zodToJsonSchema(schema, { target: "jsonSchema7", $refStrategy: "none" });

/** Rules an agent must follow, in plain words. Kept short: the schemas carry the rest. */
export const COMPOSITION_RULES = [
  "Build pages only from section ids in this catalogue. Never invent ids or props.",
  "Every page starts with header.bar and ends with footer.columns, once each.",
  "Exactly one section on a page holds the h1: a hero on home, catalogue.browse, product.detail or cart.summary.",
  "Products, prices and categories come from the store. Pick them with `source` (category, tag, sale, ids); never type products or prices as text.",
  "Pick a theme preset or write a full theme; it must pass checkTheme in light and dark.",
  "Run validateComposition on every page before saving.",
];

/** The machine-readable catalogue an AI agent reads to compose a store. */
export function buildCatalogue(registry: Registry, version = "0.1.0"): Catalogue {
  const entry = (definition: Registry["components"] extends Map<string, infer D> ? D : never): CatalogueEntry => ({
    id: definition.id,
    kind: "component",
    name: definition.name,
    description: definition.description,
    tags: definition.tags,
    props: jsonSchema(definition.props),
    examples: definition.examples.map(({ name, props }) => ({ name, props })),
  });
  return {
    version,
    components: [...registry.components.values()].map(entry),
    sections: [...registry.sections.values()].map((definition) => ({
      ...entry(definition as never),
      kind: "section",
      pages: definition.pages,
      placement: definition.placement,
      uses: definition.uses,
    })),
    pages: [...registry.pages.values()].map(({ id, name, description, pageType, requires, sections }) => ({ id, name, description, pageType, requires, sections })),
    themes: { presets: Object.keys(themes), schema: jsonSchema(themeSchema) },
    compositionSchema: jsonSchema(storeCompositionSchema),
    rules: COMPOSITION_RULES,
  };
}

/** A short text summary (~2k tokens) to put in an agent's prompt. */
export function catalogueSummary(registry: Registry): string {
  const line = (d: { id: string; description: string }) => `- ${d.id}: ${d.description}`;
  return [
    "# Storefront UI catalogue",
    "## Rules",
    ...COMPOSITION_RULES.map((rule) => `- ${rule}`),
    "## Sections (compose pages from these)",
    ...[...registry.sections.values()].map((d) => `${line(d)} [pages: ${d.pages.join(", ")}]`),
    "## Components (building blocks inside sections)",
    ...[...registry.components.values()].map(line),
    `## Theme presets: ${Object.keys(themes).join(", ")}`,
  ].join("\n");
}
