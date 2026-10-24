import { demoBanners, type ComponentDefinition, type PageContextValue, type PageDefinition, type SectionDefinition } from "../../src";

type Definition = ComponentDefinition | SectionDefinition;

/** Every `definition.tsx`, as text. Small, so it ships with the page. */
const DEFINITIONS = import.meta.glob<string>("../../src/{components,sections}/*/definition.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** The rest of each folder's source, loaded when the Source tab opens. */
const SOURCES = import.meta.glob<string>("../../src/{components,sections}/*/*.{tsx,css}", { query: "?raw", import: "default" });

interface Folder {
  /** e.g. `components/ProductCard`. */
  path: string;
  definition: string;
  /** The component a pass-through preset renders, e.g. `ProductCard`. */
  component?: string;
  /** The preset's render function, when it does more than pass props through. */
  render?: string;
}

const FOLDERS = new Map<string, Folder>();
for (const [file, text] of Object.entries(DEFINITIONS)) {
  const id = text.match(/\bid: "([^"]+)"/)?.[1];
  const path = file.match(/src\/((?:components|sections)\/[^/]+)\//)?.[1];
  if (!id || !path) continue;
  const render = text.match(/\n {2}render: function \w+\([^)]*\) \{\n[\s\S]*?\n {2}\},?\n/)?.[0];
  const passThrough = render?.match(/^\s*render: function \w+\(props\) \{\n(?:[\s\S]*?)<(\w+) \{\.\.\.props\}/);
  FOLDERS.set(id, {
    path,
    definition: text,
    component: passThrough?.[1],
    render: render
      ?.replace(/^\n {2}render: /, "")
      .replace(/,?\n$/, "")
      .replace(/^ {2}/gm, ""),
  });
}

export const folderOf = (id: string) => FOLDERS.get(id);

/** Source files of one component or section folder, definition last. */
export async function sourceFiles(id: string): Promise<{ name: string; code: string }[]> {
  const folder = FOLDERS.get(id);
  if (!folder) return [];
  const prefix = `../../src/${folder.path}/`;
  const entries = Object.entries(SOURCES).filter(([file]) => file.startsWith(prefix));
  const files = await Promise.all(entries.map(async ([file, load]) => ({ name: file.slice(prefix.length), code: await load() })));
  const rank = (name: string) => (name === "definition.tsx" ? 2 : name.endsWith(".css") ? 1 : 0);
  return files.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}

const REACT_HOOKS = new Set(["useState", "useMemo", "useEffect", "useRef", "useCallback", "useId"]);

const BANNERS = new Map<string, string>(Object.entries(demoBanners).map(([name, value]) => [value, `demoBanners.${name}`]));

/** A prop value as JSX source. Demo images stay readable as `demoBanners.warm`. */
function value(input: unknown, indent: string): string {
  if (typeof input === "string") {
    const banner = BANNERS.get(input);
    if (banner) return banner;
    if (input.startsWith("data:")) return JSON.stringify(`${input.slice(0, 26)}…`);
    return JSON.stringify(input);
  }
  if (Array.isArray(input)) {
    if (input.length === 0) return "[]";
    const inner = indent + "  ";
    return `[\n${input.map((item) => inner + value(item, inner)).join(",\n")},\n${indent}]`;
  }
  if (input && typeof input === "object") {
    const entries = Object.entries(input).filter(([, item]) => item !== undefined);
    if (entries.length === 0) return "{}";
    const inner = indent + "  ";
    const flat = entries.map(([key, item]) => `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${value(item, inner)}`);
    const oneLine = `{ ${flat.join(", ")} }`;
    return oneLine.length <= 72 && !oneLine.includes("\n") ? oneLine : `{\n${flat.map((line) => inner + line).join(",\n")},\n${indent}}`;
  }
  return String(input);
}

/** `<Name a="b" c={1} />` from props, one prop per line when long. */
export function jsx(name: string, props: Record<string, unknown> = {}, indent = ""): string {
  const attrs = Object.entries(props)
    .filter(([, item]) => item !== undefined)
    .map(([key, item]) =>
      typeof item === "string" && !BANNERS.has(item) && !item.startsWith("data:") && !item.includes('"')
        ? `${key}="${item}"`
        : item === true
          ? key
          : `${key}={${value(item, indent + "  ")}}`,
    );
  const oneLine = `${indent}<${name}${attrs.map((attr) => ` ${attr}`).join("")} />`;
  if (oneLine.length <= 88 && !oneLine.includes("\n")) return oneLine;
  return `${indent}<${name}\n${attrs.map((attr) => `${indent}  ${attr}`).join("\n")}\n${indent}/>`;
}

const imports = (names: string[]) => `import { ${[...new Set(names)].sort().join(", ")} } from "@mel-company/storefront-ui";`;

const usesBanner = (props: unknown) => JSON.stringify(props ?? {}).includes("data:image/svg+xml");

/**
 * React code for one example: the component with the example's props, or,
 * when the preset wires more than props (state, a store lookup), the preset's
 * own render function, which is the real usage.
 */
export function exampleCode(definition: Definition, props: Record<string, unknown>): string {
  const folder = FOLDERS.get(definition.id);
  if (folder?.component) {
    const names = usesBanner(props) ? [folder.component, "demoBanners"] : [folder.component];
    return `${imports(names)}\n\n${jsx(folder.component, props)}`;
  }
  if (folder?.render) {
    // The preset is real usage code: give it its imports and show it called with the example's props.
    const name = folder.render.match(/^function (\w+)Preset/)?.[1] ?? "Example";
    const body = folder.render.replace(/^function \w+Preset/, `export function ${name}Example`);
    const used = [...new Set(body.match(/<([A-Z]\w*)|\b(use[A-Z]\w*)\(/g)?.map((token) => token.replace(/[<(]/g, "")) ?? [])];
    const fromReact = used.filter((token) => REACT_HOOKS.has(token));
    const fromLibrary = used.filter((token) => !REACT_HOOKS.has(token));
    const header = [
      fromReact.length ? `import { ${fromReact.sort().join(", ")} } from "react";` : "",
      fromLibrary.length ? imports(fromLibrary) : "",
    ].filter(Boolean);
    return `${header.join("\n")}\n\n${body}\n\n${jsx(`${name}Example`, props)}`;
  }
  return jsx(definition.name.replace(/\W/g, ""), props);
}

/** The same example as stored in a page: a section entry, or a component's props. */
export function exampleJson(definition: Definition, props: Record<string, unknown>) {
  return definition.kind === "section" ? { section: definition.id, props } : props;
}

/** A page as plain React: each section as its component, in order. */
export function pageJsx(page: { sections: { section: string; props?: Record<string, unknown> }[] }): string {
  const names = page.sections.map((entry) => FOLDERS.get(entry.section)?.component ?? entry.section);
  const banner = usesBanner(page.sections) ? ["demoBanners"] : [];
  const body = page.sections
    .map((entry, index) => jsx(names[index]!, entry.props ?? {}, "      "))
    .join("\n");
  return `${imports([...names, ...banner, "Storefront"])}
import { store } from "./store"; // your StoreClient

export function Page() {
  return (
    <Storefront store={store}>
${body}
    </Storefront>
  );
}`;
}

/** A page from its JSON, the way the editor and agents save it. */
export function pageRendererCode(page: PageDefinition, context: PageContextValue): string {
  const ctx = Object.entries(context).filter(([, item]) => item);
  return `import { PageRenderer, Storefront } from "@mel-company/storefront-ui";
import { store } from "./store"; // your StoreClient
import page from "./pages/${page.id}.json";

export function Page() {
  return (
    <Storefront store={store}>
      <PageRenderer composition={page}${ctx.length ? ` context={${value(Object.fromEntries(ctx), "      ")}}` : ""} />
    </Storefront>
  );
}`;
}
