import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  builtInRegistry,
  checkComponent,
  checkPageDefinition,
  checkSection,
  compositionOf,
  seedExample,
  PageRenderer,
  type CheckReport,
  type ComponentDefinition,
  PageContextProvider,
  type PageContextValue,
  type PageDefinition,
  type SectionDefinition,
} from "../../src";
import { translateDeep } from "../i18n";
import { CheckBadge, CheckIssues } from "../parts/CheckResult";
import { CodeBlock } from "../parts/CodeBlock";
import { Frame } from "../parts/Frame";
import { highlightJson, highlightTsx } from "../parts/Highlight";
import { LivePreview } from "../parts/LivePreview";
import { initialView, route } from "../route";
import { Link } from "../router";
import { useSettings } from "../settings";
import { exampleCode, exampleJson, pageJsx, pageRendererCode, sourceFiles } from "./code";

export type DocsKind = "components" | "sections" | "pages";
type Definition = ComponentDefinition | SectionDefinition;

const COMPONENTS = [...builtInRegistry.components.values()];
const SECTIONS = [...builtInRegistry.sections.values()];
const PAGES = [...builtInRegistry.pages.values()];

const GROUPS: { kind: DocsKind; title: string; items: { id: string; name: string; description: string }[] }[] = [
  { kind: "components", title: "Components", items: COMPONENTS },
  { kind: "sections", title: "Sections", items: SECTIONS },
  { kind: "pages", title: "Pages", items: PAGES },
];

/** How the side nav lists each kind. Ids left out of every list land in "Other", so nothing goes missing. */
const SUBGROUPS: Record<DocsKind, { title: string; ids: string[] }[]> = {
  components: [
    { title: "Basics", ids: ["ui.button", "ui.badge", "ui.sectionHeading", "ui.media", "ui.feature", "ui.emptyState", "ui.skeleton"] },
    { title: "Overlays and motion", ids: ["ui.accordion", "ui.drawer", "ui.countdown", "ui.breadcrumbs"] },
    { title: "Product", ids: ["product.card", "commerce.price", "commerce.rating", "product.optionPicker", "commerce.favourite", "category.tile"] },
    { title: "Cart and orders", ids: ["commerce.addToCart", "commerce.quantityStepper", "cart.line", "cart.freeDeliveryProgress", "order.steps"] },
    { title: "Search and filters", ids: ["catalogue.search", "catalogue.categoryChips"] },
    { title: "Forms", ids: ["form.textField", "form.select", "form.radioCards"] },
  ],
  sections: [
    { title: "Header and footer", ids: ["header.bar", "footer.columns"] },
    { title: "Openers", ids: ["hero.split", "hero.banner", "hero.statement"] },
    { title: "Products and categories", ids: ["categories.tiles", "products.grid", "products.rail", "products.related", "bundle.builder"] },
    { title: "Brand and trust", ids: ["trust.strip", "offer.freeDelivery", "story.editorial", "faq.list"] },
    { title: "Shopping", ids: ["catalogue.browse", "product.detail", "favourites.grid"] },
    { title: "Cart and checkout", ids: ["cart.summary", "checkout.form", "order.confirmation"] },
    { title: "After the order", ids: ["order.tracking", "order.invoice"] },
    { title: "Errors", ids: ["error.notFound"] },
  ],
  pages: [
    { title: "Browsing", ids: ["home.classic", "home.campaign", "catalogue.default", "product.default", "favourites.default"] },
    { title: "Buying", ids: ["cart.default", "checkout.default", "confirmation.default"] },
    { title: "After the order", ids: ["tracking.default", "invoice.default"] },
    { title: "Errors", ids: ["notfound.default"] },
  ],
};

type NavItem = { id: string; name: string; description: string };

function subgroupsOf(kind: DocsKind, items: NavItem[]) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const listed = new Set(SUBGROUPS[kind].flatMap((group) => group.ids));
  const groups = SUBGROUPS[kind].map((group) => ({
    title: group.title,
    items: group.ids.map((id) => byId.get(id)).filter((item): item is NavItem => Boolean(item)),
  }));
  const rest = items.filter((item) => !listed.has(item.id));
  if (rest.length) groups.push({ title: "Other", items: rest });
  return groups.filter((group) => group.items.length > 0);
}

const INTRO: Record<DocsKind, string> = {
  components:
    "Small parts: price, rating, add to cart, product card. They read products, stock and the cart from the store you pass in, so they always show real data.",
  sections:
    "Full-width blocks built only from components: header, hero, product grid, catalogue, cart. A page is a list of these, so each one is also a JSON entry.",
  pages: "Starting layouts made of sections, stored as JSON. Render one with PageRenderer, or write the same page as plain React.",
};

const DEVICES = [
  { id: "phone", label: "Phone", width: 390 },
  { id: "tablet", label: "Tablet", width: 820 },
  { id: "desktop", label: "Desktop", width: 1280 },
] as const;
type Device = (typeof DEVICES)[number]["id"];

const hrefOf = (kind: DocsKind, id: string) => `/${kind}/${id}`;
const kindOf = (id: string): DocsKind =>
  builtInRegistry.components.has(id) ? "components" : builtInRegistry.sections.has(id) ? "sections" : "pages";

export function Docs({ kind, id }: { kind: DocsKind; id?: string }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const match = (item: { id: string; name: string; description: string }) =>
    !deferred || `${item.id} ${item.name} ${item.description}`.toLowerCase().includes(deferred);

  return (
    <div className="container wide docs">
      <aside className="docs-nav" aria-label="Library">
        <label className="search">
          <span className="sr-only">Filter</span>
          <input type="search" placeholder="Filter" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        {GROUPS.map((group) => {
          const items = group.items.filter(match);
          return (
            <nav key={group.kind} aria-label={group.title}>
              <Link href={`/${group.kind}`} className="docs-group" aria-current={group.kind === kind && !id ? "page" : undefined}>
                {group.title} <span className="count">{group.items.length}</span>
              </Link>
              {subgroupsOf(group.kind, items).map((sub) => {
                const labelId = `nav-${group.kind}-${sub.title.toLowerCase().replace(/\W+/g, "-")}`;
                return (
                  <div key={sub.title} className="docs-subgroup">
                    <p className="docs-subgroup-title" id={labelId}>
                      {sub.title}
                    </p>
                    <ul aria-labelledby={labelId}>
                      {sub.items.map((item) => (
                        <li key={item.id}>
                          <Link href={hrefOf(group.kind, item.id)} aria-current={item.id === id ? "page" : undefined}>
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </nav>
          );
        })}
      </aside>
      <main id="content" className="docs-main">
        <DocsContent kind={kind} id={id} />
      </main>
    </div>
  );
}

function DocsContent({ kind, id }: { kind: DocsKind; id?: string }) {
  if (!id) return <DocsIndex kind={kind} />;
  if (kind === "pages") {
    const page = builtInRegistry.pages.get(id);
    return page ? <PageDoc key={page.id} page={page} /> : <NotFound kind={kind} />;
  }
  const definition = kind === "components" ? builtInRegistry.components.get(id) : builtInRegistry.sections.get(id);
  return definition ? <DefinitionDoc key={definition.id} definition={definition} /> : <NotFound kind={kind} />;
}

function NotFound({ kind }: { kind: DocsKind }) {
  return (
    <div className="docs-head">
      <h1>Not found</h1>
      <p className="muted">
        Nothing with that id. See all <Link href={`/${kind}`}>{kind}</Link>.
      </p>
    </div>
  );
}

function DocsIndex({ kind }: { kind: DocsKind }) {
  const group = GROUPS.find((item) => item.kind === kind)!;
  return (
    <>
      <header className="docs-head">
        <h1>{group.title}</h1>
        <p className="muted">{INTRO[kind]}</p>
      </header>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Id</th>
              <th scope="col">{kind === "pages" ? "Sections" : "Use it for"}</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={hrefOf(kind, item.id)}>{item.name}</Link>
                </td>
                <td>
                  <code>{item.id}</code>
                </td>
                <td className="muted">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Props of a definition as rows: name, type, default, required, description. */
function propRows(definition: Definition) {
  const schema = zodToJsonSchema(definition.props, { $refStrategy: "none" }) as {
    properties?: Record<string, JsonProp>;
    required?: string[];
  };
  return Object.entries(schema.properties ?? {}).map(([name, prop]) => ({
    name,
    type: typeOf(prop),
    fallback: prop.default === undefined ? "" : JSON.stringify(prop.default),
    required: schema.required?.includes(name) ?? false,
    description: prop.description ?? "",
  }));
}

interface JsonProp {
  type?: string | string[];
  enum?: unknown[];
  items?: JsonProp;
  anyOf?: JsonProp[];
  default?: unknown;
  description?: string;
  properties?: Record<string, JsonProp>;
}

function typeOf(prop: JsonProp): string {
  if (prop.enum) return prop.enum.map((item) => JSON.stringify(item)).join(" | ");
  if (prop.anyOf) return prop.anyOf.map(typeOf).join(" | ");
  if (prop.type === "array") return `${prop.items ? typeOf(prop.items) : "unknown"}[]`;
  if (prop.type === "object") return prop.properties ? `{ ${Object.keys(prop.properties).join(", ")} }` : "object";
  return Array.isArray(prop.type) ? prop.type.join(" | ") : (prop.type ?? "unknown");
}

function runCheck(definition: Definition, theme: ReturnType<typeof useSettings>["theme"]): CheckReport {
  return definition.kind === "section" ? checkSection(definition, { theme }) : checkComponent(definition, { theme });
}

type Tab = "code" | "props" | "json" | "source" | "checks";
const TABS: { id: Tab; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "props", label: "Props" },
  { id: "json", label: "JSON" },
  { id: "source", label: "Source" },
  { id: "checks", label: "Checks" },
];

function DefinitionDoc({ definition }: { definition: Definition }) {
  const { theme, themeId, mode, dir, lang } = useSettings();
  const [exampleIndex, setExampleIndex] = useState(0);
  const [device, setDevice] = useState<Device>(() =>
    window.innerWidth < 700 ? "phone" : definition.kind === "component" ? "tablet" : "desktop",
  );
  const [tab, setTab] = useState<Tab>("code");
  const [skeleton, setSkeleton] = useState(false);
  const example = definition.examples[exampleIndex] ?? definition.examples[0];
  // In RTL the example text is shown in Arabic, like a real Arabic store would fill it in.
  const props = useMemo(() => translateDeep(lang, (example?.props ?? {}) as Record<string, unknown>), [lang, example]);
  const report = useMemo(() => runCheck(definition, theme), [definition, theme]);
  const rows = useMemo(() => propRows(definition), [definition]);
  const width = DEVICES.find((item) => item.id === device)!.width;
  const Render = (skeleton && definition.kind === "section" && definition.skeleton) || definition.render;

  const builtFrom = definition.kind === "section" ? definition.uses : [];
  const usedIn =
    definition.kind === "component"
      ? SECTIONS.filter((section) => section.uses.includes(definition.id)).map((section) => section.id)
      : PAGES.filter((page) => page.sections.some((entry) => entry.section === definition.id)).map((page) => page.id);

  const code = exampleCode(definition, props);
  const json = JSON.stringify(exampleJson(definition, props), null, 2);

  return (
    <article className="docs-article">
      <header className="docs-head">
        <p className="docs-kind">{definition.kind === "component" ? "Component" : "Section"}</p>
        <div className="docs-title">
          <h1>{definition.name}</h1>
          <CheckBadge report={report} />
        </div>
        <p className="muted">{definition.description}</p>
        <dl className="docs-meta">
          <div>
            <dt>Id</dt>
            <dd>
              <code>{definition.id}</code>
            </dd>
          </div>
          {builtFrom.length > 0 && (
            <div>
              <dt>Built from</dt>
              <dd>
                <IdLinks ids={builtFrom} />
              </dd>
            </div>
          )}
          <div>
            <dt>Used in</dt>
            <dd>{usedIn.length ? <IdLinks ids={usedIn} /> : <span className="muted">Not used by a built-in {definition.kind === "component" ? "section" : "page"} yet</span>}</dd>
          </div>
          {definition.kind === "section" && (
            <div>
              <dt>Pages</dt>
              <dd>{definition.pages.join(", ")}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="toolbar">
        {definition.examples.length > 1 ? (
          <div className="segmented" role="group" aria-label="Example">
            {definition.examples.map((item, index) => (
              <button key={item.name} type="button" aria-pressed={index === exampleIndex} onClick={() => setExampleIndex(index)}>
                {item.name}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="toolbar-end">
          {definition.kind === "section" && definition.skeleton && <SkeletonSwitch skeleton={skeleton} onChange={setSkeleton} />}
          <DeviceSwitch device={device} onChange={setDevice} />
        </div>
      </div>

      <div className="preview">
        <Frame width={width} title={`${definition.name} preview`}>
          {example && (
            <LivePreview key={`${exampleIndex}-${themeId}-${mode}-${dir}-${skeleton}`} seed={(store) => seedExample(store, example)}>
              <PageContextProvider value={example.context ?? {}}>
                <div style={{ padding: definition.kind === "component" ? 24 : 0 }}>
                  <Render {...definition.props.parse(props)} />
                </div>
              </PageContextProvider>
            </LivePreview>
          )}
        </Frame>
      </div>

      <div className="panel">
        <div className="tabs small" role="tablist" aria-label="Details">
          {TABS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        {tab === "code" && (
          <CodeBlock label={`${example?.name ?? "Example"}.tsx`} code={code}>
            {highlightTsx(code)}
          </CodeBlock>
        )}
        {tab === "props" && <PropsTable rows={rows} />}
        {tab === "json" && (
          <>
            <p className="muted small docs-note">
              {definition.kind === "section"
                ? "This section as an entry in a page's sections array. Agents write this, and validate_page checks it."
                : "The example's props. They follow the props schema below, so a tool or agent can fill them in."}
            </p>
            <CodeBlock label="JSON" code={json}>
              {highlightJson(json)}
            </CodeBlock>
            <details className="docs-schema">
              <summary>Props JSON schema</summary>
              <Json value={zodToJsonSchema(definition.props, { $refStrategy: "none" })} />
            </details>
          </>
        )}
        {tab === "source" && <SourceView id={definition.id} />}
        {tab === "checks" && <CheckIssues report={report} />}
      </div>
    </article>
  );
}

function IdLinks({ ids }: { ids: string[] }) {
  return (
    <span className="id-links">
      {ids.map((id) => (
        <Link key={id} href={hrefOf(kindOf(id), id)}>
          <code>{id}</code>
        </Link>
      ))}
    </span>
  );
}

/** Live content or the loading skeleton. */
function SkeletonSwitch({ skeleton, onChange }: { skeleton: boolean; onChange: (skeleton: boolean) => void }) {
  return (
    <div className="segmented" role="group" aria-label="State">
      <button type="button" aria-pressed={!skeleton} onClick={() => onChange(false)}>
        Live
      </button>
      <button type="button" aria-pressed={skeleton} onClick={() => onChange(true)}>
        Skeleton
      </button>
    </div>
  );
}

function DeviceSwitch({ device, onChange }: { device: Device; onChange: (device: Device) => void }) {
  return (
    <div className="segmented" role="group" aria-label="Device width">
      {DEVICES.map((item) => (
        <button key={item.id} type="button" aria-pressed={device === item.id} onClick={() => onChange(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function PropsTable({ rows }: { rows: ReturnType<typeof propRows> }) {
  if (rows.length === 0) return <p className="muted small">No props.</p>;
  return (
    <div className="table-scroll">
      <table className="table props-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required && <span className="req"> required</span>}
              </td>
              <td>
                <code className="type">{row.type}</code>
              </td>
              <td>{row.fallback ? <code>{row.fallback}</code> : <span className="muted">–</span>}</td>
              <td className="muted">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceView({ id }: { id: string }) {
  const [files, setFiles] = useState<{ name: string; code: string }[] | null>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let live = true;
    setFiles(null);
    setActive(0);
    void sourceFiles(id).then((result) => live && setFiles(result));
    return () => {
      live = false;
    };
  }, [id]);
  if (!files) return <p className="muted small">Loading source…</p>;
  const file = files[active];
  return (
    <>
      <div className="segmented files" role="group" aria-label="File">
        {files.map((item, index) => (
          <button key={item.name} type="button" aria-pressed={index === active} onClick={() => setActive(index)}>
            {item.name}
          </button>
        ))}
      </div>
      {file && (
        <CodeBlock label={file.name} code={file.code}>
          {file.name.endsWith(".tsx") ? highlightTsx(file.code) : file.code}
        </CodeBlock>
      )}
    </>
  );
}

type PageTab = "json" | "renderer" | "jsx" | "sections" | "checks";
const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "renderer", label: "Render the JSON" },
  { id: "jsx", label: "Plain React" },
  { id: "sections", label: "Sections" },
  { id: "checks", label: "Checks" },
];

function PageDoc({ page }: { page: PageDefinition }) {
  const { theme, themeId, mode, dir, lang } = useSettings();
  const [device, setDevice] = useState<Device>(() => (window.innerWidth < 700 ? "phone" : "desktop"));
  const [tab, setTab] = useState<PageTab>("json");
  const [view, setView] = useState(() => initialView(page));
  const [skeleton, setSkeleton] = useState(false);
  const composition = useMemo(() => translateDeep(lang, compositionOf(page)), [lang, page]);
  const report = useMemo(() => checkPageDefinition(page, { theme }), [page, theme]);
  const width = DEVICES.find((item) => item.id === device)!.width;
  const json = JSON.stringify(composition, null, 2);
  const away = view.page.id !== page.id;
  const shown = away ? translateDeep(lang, compositionOf(view.page)) : composition;
  const context: PageContextValue = view.context;

  return (
    <article className="docs-article">
      <header className="docs-head">
        <p className="docs-kind">Page · {page.pageType}</p>
        <div className="docs-title">
          <h1>{page.name}</h1>
          <CheckBadge report={report} />
        </div>
        <p className="muted">{page.description}</p>
        <dl className="docs-meta">
          <div>
            <dt>Id</dt>
            <dd>
              <code>{page.id}</code>
            </dd>
          </div>
          <div>
            <dt>Must include</dt>
            <dd>
              <IdLinks ids={page.requires} />
            </dd>
          </div>
        </dl>
      </header>

      <div className="toolbar">
        {away ? (
          <button type="button" className="btn btn-sm" onClick={() => setView(initialView(page))}>
            Back to {page.name}
          </button>
        ) : (
          <span className="muted small">Links in the preview work.</span>
        )}
        <div className="toolbar-end">
          <SkeletonSwitch skeleton={skeleton} onChange={setSkeleton} />
          <DeviceSwitch device={device} onChange={setDevice} />
        </div>
      </div>

      <div className="preview">
        <Frame width={width} title={`${page.name} preview`} maxHeight={760} scrollKey={`${view.page.id}-${view.context.productSlug ?? ""}-${view.context.categorySlug ?? ""}`}>
          <LivePreview key={`${themeId}-${mode}-${dir}`} seed={(store) => seedExample(store, page.preview)} onNavigate={(href) => setView(route(href))}>
            <PageRenderer composition={shown} context={context} loading={skeleton} />
          </LivePreview>
        </Frame>
      </div>

      <div className="panel">
        <div className="tabs small" role="tablist" aria-label="Details">
          {PAGE_TABS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        {tab === "json" && (
          <CodeBlock label={`${page.id}.json`} code={json}>
            {highlightJson(json)}
          </CodeBlock>
        )}
        {tab === "renderer" && (
          <>
            <p className="muted small docs-note">Save the JSON, then render it. Editors and AI agents change the JSON, never this code.</p>
            <Tsx label="Page.tsx" code={pageRendererCode(page, initialView(page).context)} />
          </>
        )}
        {tab === "jsx" && (
          <>
            <p className="muted small docs-note">The same page without JSON: every section is a React component you can use directly.</p>
            <Tsx label="Page.tsx" code={pageJsx(composition)} />
          </>
        )}
        {tab === "sections" && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="num">
                    #
                  </th>
                  <th scope="col">Section</th>
                  <th scope="col">Key</th>
                </tr>
              </thead>
              <tbody>
                {page.sections.map((entry, index) => (
                  <tr key={entry.key ?? index}>
                    <td className="num muted">{index + 1}</td>
                    <td>
                      <Link href={hrefOf("sections", entry.section)}>{builtInRegistry.sections.get(entry.section)?.name ?? entry.section}</Link>{" "}
                      <code>{entry.section}</code>
                    </td>
                    <td className="muted">{entry.key ?? "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "checks" && <CheckIssues report={report} />}
      </div>
    </article>
  );
}

function Tsx({ label, code }: { label: string; code: string }) {
  return (
    <CodeBlock label={label} code={code}>
      {highlightTsx(code)}
    </CodeBlock>
  );
}

function Json({ value }: { value: unknown }) {
  const code = JSON.stringify(value, null, 2);
  return (
    <CodeBlock code={code} label="JSON schema">
      {highlightJson(code)}
    </CodeBlock>
  );
}
