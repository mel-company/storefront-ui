import type { ComponentDefinition, PageDefinition, SectionDefinition } from "../core/define";
import type { Registry } from "../core/registry";
import type { PageCompositionInput } from "../pages/composition";
import type { PageContextValue } from "../sections/_shared/PageContext";
import { pageCompositionSchema } from "../pages/composition";
import { builtInRegistry } from "../registry";
import type { Theme } from "../theme/schema";
import { defaultTheme } from "../theme/presets";
import { browserParser, checkDom, countHeadings, type HtmlParser } from "./dom";
import { exampleElement, pageElement, toHtml, type RenderOptions } from "./render";
import { toReport, type CheckIssue, type CheckReport } from "./types";

export interface CheckOptions {
  registry?: Registry;
  theme?: Theme;
  parse?: HtmlParser;
}

/** Every example renders in all four combinations. */
const VARIANTS: Required<Pick<RenderOptions, "mode" | "dir">>[] = [
  { mode: "light", dir: "ltr" },
  { mode: "dark", dir: "ltr" },
  { mode: "light", dir: "rtl" },
  { mode: "dark", dir: "rtl" },
];

/** Skeletons have no data to vary, so two opposite corners are enough. */
const SKELETON_VARIANTS: typeof VARIANTS = [
  { mode: "light", dir: "ltr" },
  { mode: "dark", dir: "rtl" },
];

const ID = /^[a-z][a-z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/;

function checkMeta(definition: ComponentDefinition | SectionDefinition | PageDefinition): { issues: CheckIssue[]; checks: number } {
  const issues: CheckIssue[] = [];
  if (!ID.test(definition.id)) issues.push({ severity: "error", rule: "meta.id", message: `Id "${definition.id}" must look like family.name` });
  if (definition.description.length < 20 || definition.description.length > 220) {
    issues.push({ severity: "warning", rule: "meta.description", message: "Description should be one clear line (20–220 characters); agents choose by it." });
  }
  if (definition.kind !== "page" && definition.tags.length === 0) issues.push({ severity: "warning", rule: "meta.tags", message: "Add at least one tag." });
  if (definition.kind !== "page" && definition.examples.length === 0) issues.push({ severity: "error", rule: "meta.examples", message: "Add at least one example." });
  return { issues, checks: 4 };
}

/** Renders one element and runs the DOM rules over it. */
function renderAndCheck(render: () => string, where: string, parse: HtmlParser) {
  try {
    const doc = parse(render());
    const root = doc.querySelector(".msu-root");
    if (!root) return { issues: [{ severity: "error" as const, rule: "render.root", message: "No themed root rendered.", where }], checks: 1, root: null };
    return { ...checkDom(root, where), root };
  } catch (error) {
    return {
      issues: [{ severity: "error" as const, rule: "render.throws", message: `Threw while rendering: ${(error as Error).message}`, where }],
      checks: 1,
      root: null,
    };
  }
}

/** The component checker: metadata, every example against the schema, render and DOM rules in light, dark, LTR and RTL. */
export function checkComponent(definition: ComponentDefinition | SectionDefinition, options: CheckOptions = {}): CheckReport {
  const parse = options.parse ?? browserParser;
  const theme = options.theme ?? defaultTheme;
  const registry = options.registry ?? builtInRegistry;
  const meta = checkMeta(definition);
  const issues = [...meta.issues];
  let checks = meta.checks;

  for (const example of definition.examples) {
    checks += 1;
    const parsed = definition.props.safeParse(example.props);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({ severity: "error", rule: "schema.example", where: example.name, message: `${issue.path.join(".") || "props"}: ${issue.message}` });
      }
      continue;
    }
    for (const variant of VARIANTS) {
      const where = `${example.name} · ${variant.mode} · ${variant.dir}`;
      const result = renderAndCheck(() => toHtml(exampleElement(definition, example, { ...variant, theme, registry })), where, parse);
      issues.push(...result.issues);
      checks += result.checks;
      if (definition.kind === "section" && result.root) {
        const section = checkSectionShape(definition, result.root, where);
        issues.push(...section.issues);
        checks += section.checks;
      }
      // Light/LTR is enough to find DOM problems; other variants only need to render.
      if (result.issues.length) break;
    }
  }

  if (definition.kind === "section") {
    const skeleton = checkSkeleton(definition, { theme, registry, parse });
    issues.push(...skeleton.issues);
    checks += skeleton.checks;
  }

  return toReport(definition.id, definition.kind, dedupe(issues), checks);
}

/** Every section has a skeleton: same landmark, marked busy, and it passes the DOM rules in light/LTR and dark/RTL. */
function checkSkeleton(definition: SectionDefinition, { theme, registry, parse }: { theme: Theme; registry: Registry; parse: HtmlParser }) {
  if (!definition.skeleton) {
    return { issues: [{ severity: "error" as const, rule: "section.skeleton", message: "Add a skeleton: the loading version of this section." }], checks: 1 };
  }
  const issues: CheckIssue[] = [];
  let checks = 1;
  for (const example of definition.examples) {
    if (!definition.props.safeParse(example.props).success) continue;
    for (const variant of SKELETON_VARIANTS) {
      const where = `skeleton · ${example.name} · ${variant.mode} · ${variant.dir}`;
      const result = renderAndCheck(() => toHtml(exampleElement(definition, example, { ...variant, theme, registry, skeleton: true })), where, parse);
      issues.push(...result.issues);
      checks += result.checks + 1;
      if (result.root) {
        const shape = checkSectionShape(definition, result.root, where);
        issues.push(...shape.issues);
        checks += shape.checks;
        if (!result.root.querySelector("[aria-busy='true']")) {
          issues.push({ severity: "error", rule: "skeleton.busy", where, message: "Mark the skeleton's landmark aria-busy so screen readers know it is loading." });
        }
        if (result.root.querySelector("a, button, input, select, textarea")) {
          issues.push({ severity: "error", rule: "skeleton.interactive", where, message: "A skeleton has nothing to press or fill in." });
        }
      }
    }
  }
  return { issues, checks };
}

function checkSectionShape(definition: SectionDefinition, root: Element, where: string) {
  const issues: CheckIssue[] = [];
  const tag = definition.placement === "header" ? "header" : definition.placement === "footer" ? "footer" : "section";
  const landmark = root.querySelector(tag);
  if (!landmark) {
    issues.push({ severity: "error", rule: "section.landmark", where, message: `A ${definition.placement} section must render a <${tag}>.` });
  } else if (tag === "section" && !landmark.getAttribute("aria-labelledby") && !landmark.getAttribute("aria-label")) {
    issues.push({ severity: "error", rule: "section.name", where, message: "The <section> needs aria-labelledby or aria-label." });
  }
  if (countHeadings(root, 1) > 1) issues.push({ severity: "error", rule: "section.h1", where, message: "A section may hold at most one h1." });
  return { issues, checks: 3 };
}

/** The section checker: everything the component checker does, plus its building blocks and landmark. */
export function checkSection(definition: SectionDefinition, options: CheckOptions = {}): CheckReport {
  const registry = options.registry ?? builtInRegistry;
  const report = checkComponent(definition, options);
  const issues = [...report.issues];
  for (const id of definition.uses) {
    if (!registry.components.has(id)) issues.push({ severity: "error", rule: "section.uses", message: `Uses unknown component "${id}".` });
  }
  if (definition.pages.length === 0) issues.push({ severity: "error", rule: "section.pages", message: "List the pages this section belongs on." });
  return toReport(definition.id, "section", issues, report.checks + definition.uses.length + 1);
}

/**
 * Checks a page composition without rendering: sections exist, props are
 * valid, required sections present, header first and footer last. This is
 * what an agent's output must pass before it is saved.
 */
export function validateComposition(
  composition: unknown,
  pageType: PageDefinition["pageType"],
  options: Pick<CheckOptions, "registry"> & { requires?: string[] } = {},
): CheckReport {
  const registry = options.registry ?? builtInRegistry;
  const parsed = pageCompositionSchema.safeParse(composition);
  const target = typeof composition === "object" && composition && "page" in composition ? String(composition.page) : "page";
  if (!parsed.success) {
    return toReport(target, "composition", parsed.error.issues.map((issue) => ({ severity: "error", rule: "schema.composition", message: `${issue.path.join(".")}: ${issue.message}` })), 1);
  }
  const page = parsed.data;
  const issues: CheckIssue[] = [];
  let checks = 1;
  const requires = options.requires ?? registry.pages.get(page.page)?.requires ?? ["header.bar", "footer.columns"];

  const keys = new Set<string>();
  page.sections.forEach((instance, index) => {
    const where = `#${index + 1} ${instance.section}`;
    checks += 3;
    const definition = registry.sections.get(instance.section);
    if (!definition) {
      issues.push({ severity: "error", rule: "composition.unknown-section", where, message: `No section "${instance.section}". Pick one from the catalogue.` });
      return;
    }
    const props = definition.props.safeParse(instance.props);
    if (!props.success) {
      for (const issue of props.error.issues) {
        issues.push({ severity: "error", rule: "composition.props", where, message: `${issue.path.join(".") || "props"}: ${issue.message}` });
      }
    }
    if (!definition.pages.includes("any") && !definition.pages.includes(pageType)) {
      issues.push({ severity: "warning", rule: "composition.page-fit", where, message: `"${instance.section}" is meant for ${definition.pages.join(", ")} pages.` });
    }
    if (instance.key) {
      if (keys.has(instance.key)) issues.push({ severity: "error", rule: "composition.duplicate-key", where, message: `Key "${instance.key}" is used twice.` });
      keys.add(instance.key);
    }
  });

  for (const id of requires) {
    checks += 1;
    if (!page.sections.some((instance) => instance.section === id)) {
      issues.push({ severity: "error", rule: "composition.required", message: `A ${pageType} page needs "${id}".` });
    }
  }

  const placements = page.sections.map((instance) => registry.sections.get(instance.section)?.placement ?? "body");
  checks += 2;
  if (placements.filter((p) => p === "header").length > 1 || placements.filter((p) => p === "footer").length > 1) {
    issues.push({ severity: "error", rule: "composition.chrome-once", message: "Only one header and one footer per page." });
  }
  const firstHeader = placements.indexOf("header");
  const lastFooter = placements.lastIndexOf("footer");
  if ((firstHeader > 0) || (lastFooter !== -1 && lastFooter !== placements.length - 1)) {
    issues.push({ severity: "error", rule: "composition.chrome-order", message: "The header goes first and the footer last." });
  }

  return toReport(page.page, "composition", issues, checks);
}

/** The page checker: composition rules, then a full render with one h1 and the DOM rules over the whole page. */
export function checkPage(
  composition: PageCompositionInput,
  pageType: PageDefinition["pageType"],
  options: CheckOptions & { context?: PageContextValue; preview?: PageDefinition["preview"] } = {},
): CheckReport {
  const parse = options.parse ?? browserParser;
  const theme = options.theme ?? defaultTheme;
  const registry = options.registry ?? builtInRegistry;
  const structural = validateComposition(composition, pageType, { registry });
  const issues = [...structural.issues];
  let checks = structural.checks;
  if (!structural.ok) return toReport(composition.page, "page", issues, checks);

  const context = options.context ?? defaultContext(pageType);
  for (const variant of VARIANTS) {
    const where = `${variant.mode} · ${variant.dir}`;
    const result = renderAndCheck(() => toHtml(pageElement(composition, context, { ...variant, theme, registry, preview: options.preview })), where, parse);
    issues.push(...result.issues);
    checks += result.checks;
    if (result.root) {
      checks += 2;
      const h1 = countHeadings(result.root, 1);
      if (h1 !== 1) issues.push({ severity: "error", rule: "page.h1", where, message: `A page needs exactly one h1, found ${h1}.` });
      if (result.root.querySelectorAll("main").length !== 1) issues.push({ severity: "error", rule: "page.main", where, message: "A page needs exactly one <main>." });
    }
    if (issues.some((issue) => issue.severity === "error")) break;
  }
  // The loading page: every section as its skeleton, still one <main>.
  const loading = renderAndCheck(() => toHtml(pageElement(composition, context, { mode: "light", dir: "ltr", theme, registry, preview: options.preview, skeleton: true })), "skeleton", parse);
  issues.push(...loading.issues);
  checks += loading.checks + 1;
  if (loading.root && loading.root.querySelectorAll("main").length !== 1) {
    issues.push({ severity: "error", rule: "page.main", where: "skeleton", message: "A page needs exactly one <main>." });
  }
  return toReport(composition.page, "page", dedupe(issues), checks);
}

export function checkPageDefinition(definition: PageDefinition, options: CheckOptions = {}): CheckReport {
  const meta = checkMeta(definition);
  const report = checkPage({ page: definition.id, sections: definition.sections }, definition.pageType, { preview: definition.preview, ...options });
  return toReport(definition.id, "page", [...meta.issues, ...report.issues], meta.checks + report.checks);
}

/** What a page of this type is about when nothing more is known, for checks and previews. */
export function defaultContext(pageType: PageDefinition["pageType"]): PageContextValue {
  if (pageType === "product") return { productSlug: "cloud-cream" };
  if (pageType === "confirmation") return { orderNumber: "1042" };
  return {};
}

function dedupe(issues: CheckIssue[]): CheckIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.rule}|${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
