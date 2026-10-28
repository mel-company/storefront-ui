/**
 * `npm run mcp`: an MCP server over stdio that lets an AI agent read the
 * catalogue and check its own work before saving a store.
 *
 *   list_sections   sections that fit a page type, one line each
 *   get_definition  full props schema and examples for one component or section
 *   validate_page   composition rules, and optionally a full render check
 *   check_theme     the global theme checker, light and dark
 *   get_catalogue   the whole catalogue as JSON, or the ~2k-token summary
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { JSDOM } from "jsdom";
import { z } from "zod";
import {
  buildCatalogue,
  builtInRegistry,
  catalogueSummary,
  checkPage,
  checkTheme,
  themes,
  validateComposition,
  type CheckReport,
  type PageCompositionInput,
} from "../src";

const parse = (html: string) => new JSDOM(html).window.document;
const pageTypes = ["home", "catalogue", "product", "cart", "checkout", "confirmation", "tracking", "invoice", "favourites", "notFound"] as const;

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const report = (result: CheckReport) => ({ ...json(result), isError: false });

const server = new McpServer({ name: "storefront-ui", version: "0.1.0" });

server.registerTool(
  "list_sections",
  {
    description: "List the sections an agent can place on a page type, one line each. Start here.",
    inputSchema: { pageType: z.enum(pageTypes).optional().describe("Only sections that fit this page type") },
  },
  async ({ pageType }) => {
    const sections = [...builtInRegistry.sections.values()].filter(
      (section) => !pageType || section.pages.includes("any") || section.pages.includes(pageType),
    );
    return json(
      sections.map(({ id, name, description, pages, placement }) => ({ id, name, description, pages, placement })),
    );
  },
);

server.registerTool(
  "get_definition",
  {
    description: "Get the full JSON props schema and examples for one component or section id.",
    inputSchema: { id: z.string().describe("A component or section id, like products.grid") },
  },
  async ({ id }) => {
    const catalogue = buildCatalogue(builtInRegistry);
    const entry = [...catalogue.sections, ...catalogue.components].find((item) => item.id === id);
    if (!entry) {
      return { ...json({ error: `No component or section "${id}". Call list_sections.` }), isError: true };
    }
    return json(entry);
  },
);

server.registerTool(
  "validate_page",
  {
    description:
      "Check a page composition before saving it: known sections, valid props, header first, footer last, required sections. With render: true it also renders the page in light, dark, LTR and RTL and runs the accessibility and one-h1 checks.",
    inputSchema: {
      composition: z
        .object({ page: z.string(), sections: z.array(z.object({ section: z.string(), key: z.string().optional(), props: z.record(z.unknown()).optional() })) })
        .describe("{ page, sections: [{ section, key?, props }] }"),
      pageType: z.enum(pageTypes),
      render: z.boolean().optional().describe("Also render the page and run the DOM checks (slower)"),
      theme: z.string().optional().describe("Theme preset id for the render check"),
    },
  },
  async ({ composition, pageType, render, theme }) => {
    if (!render) return report(validateComposition(composition, pageType));
    const preset = theme ? themes[theme as keyof typeof themes] : undefined;
    return report(checkPage(composition as PageCompositionInput, pageType, { parse, theme: preset }));
  },
);

server.registerTool(
  "check_theme",
  {
    description:
      "Run the global theme checker on a preset id or a full theme object: schema, WCAG contrast for every colour pair the components draw, in light and dark.",
    inputSchema: { theme: z.union([z.string(), z.record(z.unknown())]).describe("A preset id or a full theme object") },
  },
  async ({ theme }) => {
    if (typeof theme === "string") {
      const preset = themes[theme as keyof typeof themes];
      if (!preset) return { ...json({ error: `No preset "${theme}". Presets: ${Object.keys(themes).join(", ")}` }), isError: true };
      return report(checkTheme(preset));
    }
    return report(checkTheme(theme));
  },
);

server.registerTool(
  "get_catalogue",
  {
    description: "Get the whole catalogue: format 'summary' (~2k tokens, for a prompt) or 'json' (every schema, example, page and rule).",
    inputSchema: { format: z.enum(["summary", "json"]).optional() },
  },
  async ({ format }) =>
    format === "json" ? json(buildCatalogue(builtInRegistry)) : { content: [{ type: "text" as const, text: catalogueSummary(builtInRegistry) }] },
);

await server.connect(new StdioServerTransport());
