import { useDeferredValue, useMemo, useState } from "react";
import { zodToJsonSchema } from "zod-to-json-schema";
import { builtInRegistry, checkComponent, checkSection, fillCart, type CheckReport, type ComponentDefinition, type SectionDefinition } from "../../src";
import { useSettings } from "../settings";
import { CheckBadge, CheckIssues } from "./CheckResult";
import { CodeBlock } from "./CodeBlock";
import { Frame } from "./Frame";
import { highlightJson } from "./Highlight";
import { LivePreview } from "./LivePreview";
import { Link } from "../router";
import { translateDeep } from "../i18n";

type Tab = "components" | "sections";
type Definition = ComponentDefinition | SectionDefinition;

const DEVICES = [
  { id: "phone", label: "Phone", width: 390 },
  { id: "tablet", label: "Tablet", width: 820 },
  { id: "desktop", label: "Desktop", width: 1280 },
] as const;

const itemsFor = (tab: Tab): Definition[] =>
  tab === "components" ? [...builtInRegistry.components.values()] : [...builtInRegistry.sections.values()];

function runCheck(definition: Definition, theme: ReturnType<typeof useSettings>["theme"]): CheckReport {
  if (definition.kind === "section") return checkSection(definition, { theme });
  return checkComponent(definition, { theme });
}

export function Gallery() {
  const { theme, themeId, mode, dir, lang } = useSettings();
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
  const example = selected.examples[exampleIndex] ?? selected.examples[0];
  // In RTL the example text is shown in Arabic, like a real Arabic store would fill it in.
  const exampleProps = useMemo(() => translateDeep(lang, example?.props), [lang, example]);
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
  const Render = selected.render;

  return (
    <section className="block" id="components" aria-labelledby="gallery-title">
      <div className="container">
      <header className="block-head">
        <h2 id="gallery-title">Components and sections</h2>
        <p className="muted">
          Each example is rendered here and checked in light, dark, LTR and RTL. Theme, mode and direction follow the switches in the top
          bar. For code, props and source, open the <Link href="/components">docs</Link>.
        </p>
      </header>

      <div className="tabs" role="tablist" aria-label="Library layer">
        {(["components", "sections"] as const).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => switchTab(item)}>
            {item[0]!.toUpperCase() + item.slice(1)} <span className="count">{itemsFor(item).length}</span>
          </button>
        ))}
      </div>

      <div className="gallery">
        <aside className="gallery-list">
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
          <div className="detail-head">
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
            </div>
            <CheckBadge report={report} />
          </div>

          <div className="toolbar">
            {selected.examples.length > 1 && (
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

          <div className="preview">
            <Frame width={width} title={`${selected.name} preview`}>
              {example && (
                <LivePreview key={previewKey} seed={(store) => fillCart(store, example.cart)}>
                  <div style={{ padding: selected.kind === "component" ? 24 : 0 }}>
                    <Render {...selected.props.parse(exampleProps)} />
                  </div>
                </LivePreview>
              )}
            </Frame>
          </div>

          <div className="panel">
            <div className="tabs small" role="tablist" aria-label="Details">
              {(["checks", "props", "schema"] as const).map((item) => (
                <button key={item} type="button" role="tab" aria-selected={panel === item} onClick={() => setPanel(item)}>
                  {item === "checks" ? "Checks" : item === "props" ? "Example props" : "Props schema"}
                </button>
              ))}
            </div>
            {panel === "checks" && <CheckIssues report={report} />}
            {panel === "props" && <Json value={exampleProps} />}
            {panel === "schema" && <Json value={zodToJsonSchema(selected.props, { $refStrategy: "none" })} />}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function Json({ value }: { value: unknown }) {
  const code = JSON.stringify(value, null, 2);
  return (
    <CodeBlock code={code} label="JSON">
      {highlightJson(code)}
    </CodeBlock>
  );
}
