import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  builtInRegistry,
  cartDefault,
  catalogueDefault,
  checkComponent,
  checkPageDefinition,
  checkSection,
  compositionOf,
  PageRenderer,
  productDefault,
  type CheckReport,
  type ComponentDefinition,
  type PageContextValue,
  type PageDefinition,
  type SectionDefinition,
} from "../../src";
import { useSettings } from "../settings";
import { CheckBadge, CheckIssues } from "./CheckResult";
import { CodeBlock } from "./CodeBlock";
import { Frame } from "./Frame";
import { LivePreview } from "./LivePreview";

type Tab = "components" | "sections" | "pages";
type Definition = ComponentDefinition | SectionDefinition | PageDefinition;

const DEVICES = [
  { id: "phone", label: "Phone", width: 390 },
  { id: "tablet", label: "Tablet", width: 820 },
  { id: "desktop", label: "Desktop", width: 1280 },
] as const;

const itemsFor = (tab: Tab): Definition[] =>
  tab === "components"
    ? [...builtInRegistry.components.values()]
    : tab === "sections"
      ? [...builtInRegistry.sections.values()]
      : [...builtInRegistry.pages.values()];

function runCheck(definition: Definition, theme: ReturnType<typeof useSettings>["theme"]): CheckReport {
  if (definition.kind === "page") return checkPageDefinition(definition, { theme });
  if (definition.kind === "section") return checkSection(definition, { theme });
  return checkComponent(definition, { theme });
}

/** Turns a preview link into the page it points at, so the Pages tab is a clickable store. */
function route(href: string, home: PageDefinition): { page: PageDefinition; context: PageContextValue } {
  const path = href.replace(/^#/, "");
  const product = path.match(/^\/product\/([^/?]+)/);
  if (product) return { page: productDefault, context: { productSlug: product[1] } };
  const category = path.match(/^\/category\/([^/?]+)/);
  if (category) return { page: catalogueDefault, context: { categorySlug: category[1] } };
  if (path.startsWith("/products")) return { page: catalogueDefault, context: {} };
  if (path.startsWith("/cart") || path.startsWith("/checkout")) return { page: cartDefault, context: {} };
  return { page: home, context: {} };
}

function PagePreview({ definition }: { definition: PageDefinition }) {
  const [view, setView] = useState<{ page: PageDefinition; context: PageContextValue }>(() => ({
    page: definition,
    context: definition.pageType === "product" ? { productSlug: "cloud-cream" } : {},
  }));
  const home = definition.pageType === "home" ? definition : builtInRegistry.pages.get("home.classic")!;
  const navigate = useCallback((href: string) => setView(route(href, home)), [home]);
  return (
    <LivePreview onNavigate={navigate}>
      <PageRenderer key={`${view.page.id}-${view.context.productSlug ?? ""}-${view.context.categorySlug ?? ""}`} composition={compositionOf(view.page)} context={view.context} />
    </LivePreview>
  );
}

export function Gallery() {
  const { theme, themeId, mode, dir } = useSettings();
  const [tab, setTab] = useState<Tab>("sections");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("hero.split");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [panel, setPanel] = useState<"checks" | "props" | "schema">("checks");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const items = useMemo(() => itemsFor(tab), [tab]);
  const filtered = items.filter((item) =>
    !deferredQuery || `${item.id} ${item.name} ${item.description} ${"tags" in item ? item.tags.join(" ") : ""}`.toLowerCase().includes(deferredQuery),
  );
  const selected = items.find((item) => item.id === selectedId) ?? items[0]!;
  const example = selected.kind !== "page" ? (selected.examples[exampleIndex] ?? selected.examples[0]) : undefined;
  const report = useMemo(() => runCheck(selected, theme), [selected, theme]);
  const width = DEVICES.find((item) => item.id === device)!.width;

  const select = (id: string) => {
    setSelectedId(id);
    setExampleIndex(0);
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    const first = itemsFor(next)[0];
    if (first) select(first.id);
    setDevice(next === "components" ? "tablet" : "desktop");
  };

  const previewKey = `${selected.id}-${exampleIndex}-${themeId}-${mode}-${dir}`;
  const Render = selected.kind !== "page" ? selected.render : null;

  return (
    <section className="block" id="gallery" aria-labelledby="gallery-title">
      <div className="block-head">
        <p className="eyebrow">Live gallery</p>
        <h2 id="gallery-title">Every piece, rendered and checked in your browser</h2>
        <p className="muted">Switch theme, dark mode and RTL at the top. Pages are clickable: open a product, filter the catalogue, fill the cart.</p>
      </div>

      <div className="tabs" role="tablist" aria-label="Library layer">
        {(["components", "sections", "pages"] as const).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => switchTab(item)}>
            {item[0]!.toUpperCase() + item.slice(1)} <span className="count">{itemsFor(item).length}</span>
          </button>
        ))}
      </div>

      <div className="gallery">
        <aside className="gallery-list glass">
          <label className="search">
            <span className="sr-only">Filter</span>
            <input type="search" placeholder={`Filter ${tab}`} value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <ul>
            {filtered.map((item) => (
              <li key={item.id}>
                <button type="button" aria-current={item.id === selected.id} onClick={() => select(item.id)}>
                  <span className="item-name">{item.name}</span>
                  <code>{item.id}</code>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="muted small">Nothing matches.</li>}
          </ul>
        </aside>

        <div className="gallery-main">
          <div className="glass detail-head">
            <div>
              <h3>
                {selected.name} <code>{selected.id}</code>
              </h3>
              <p className="muted">{selected.description}</p>
              {selected.kind === "section" && selected.uses.length > 0 && (
                <p className="uses small">
                  Built from: {selected.uses.map((id) => <code key={id}>{id}</code>)}
                </p>
              )}
              {selected.kind === "page" && (
                <p className="uses small">
                  Sections: {selected.sections.map((s, i) => <code key={`${s.section}-${i}`}>{s.section}</code>)}
                </p>
              )}
            </div>
            <CheckBadge report={report} />
          </div>

          <div className="toolbar">
            {selected.kind !== "page" && selected.examples.length > 1 && (
              <div className="segmented" role="group" aria-label="Example">
                {selected.examples.map((item, index) => (
                  <button key={item.name} type="button" aria-pressed={index === exampleIndex} onClick={() => setExampleIndex(index)}>
                    {item.name}
                  </button>
                ))}
              </div>
            )}
            <div className="segmented" role="group" aria-label="Device width">
              {DEVICES.map((item) => (
                <button key={item.id} type="button" aria-pressed={device === item.id} onClick={() => setDevice(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="preview glass">
            <Frame key={`${tab}-${width}`} width={width} title={`${selected.name} preview`} maxHeight={selected.kind === "page" ? 1800 : undefined}>
              {selected.kind === "page" ? (
                <PagePreview key={previewKey} definition={selected} />
              ) : (
                Render &&
                example && (
                  <LivePreview key={previewKey} seed={(store) => example.cart?.forEach((line) => store.addToCart(line.productId, line.quantity, line.options))}>
                    <div style={{ padding: selected.kind === "component" ? 24 : 0 }}>
                      <Render {...selected.props.parse(example.props)} />
                    </div>
                  </LivePreview>
                )
              )}
            </Frame>
          </div>

          <div className="glass panel">
            <div className="tabs small" role="tablist" aria-label="Details">
              {(["checks", "props", "schema"] as const).map((item) => (
                <button key={item} type="button" role="tab" aria-selected={panel === item} onClick={() => setPanel(item)}>
                  {item === "checks" ? "Checks" : item === "props" ? (selected.kind === "page" ? "Composition" : "Example props") : "Props schema"}
                </button>
              ))}
            </div>
            {panel === "checks" && <CheckIssues report={report} />}
            {panel === "props" && (
              <CodeBlock code={JSON.stringify(selected.kind === "page" ? compositionOf(selected) : example?.props, null, 2)} />
            )}
            {panel === "schema" && (
              <CodeBlock
                code={
                  selected.kind === "page"
                    ? JSON.stringify({ requires: selected.requires, pageType: selected.pageType }, null, 2)
                    : JSON.stringify(zodToJsonSchema(selected.props, { $refStrategy: "none" }), null, 2)
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
