import { useCallback, useMemo, useRef, useState } from "react";
import {
  builtInRegistry,
  compositionOf,
  pageCompositionSchema,
  PageRenderer,
  seedExample,
  validateComposition,
  type PageComposition,
  type PageContextValue,
  type StoreClient,
} from "../../src";
import { initialView, route } from "../route";
import { useSettings } from "../settings";
import { Frame } from "./Frame";
import { highlightJson } from "./Highlight";
import { LivePreview } from "./LivePreview";
import { translateDeep, type Lang } from "../i18n";

const PAGES = [...builtInRegistry.pages.values()];

/** Every page's preview cart and favourites, so checkout and favourites open filled. */
const seedPreviews = (store: StoreClient) => PAGES.forEach((page) => seedExample(store, page.preview));
const DEVICES = [
  { id: "phone", label: "390", width: 390 },
  { id: "desktop", label: "1280", width: 1280 },
] as const;

const sourceOf = (id: string, lang: Lang) => JSON.stringify(translateDeep(lang, compositionOf(builtInRegistry.pages.get(id)!)), null, 2);

function parse(text: string): { value?: unknown; error?: string } {
  try {
    return { value: JSON.parse(text) as unknown };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

/** Page JSON on the left, the rendered store on the right. Edits re-render and re-validate as you type. */
export function Playground() {
  const { themeId, mode, dir, lang } = useSettings();
  const [activeId, setActiveId] = useState(PAGES[0]!.id);
  const [sources, setSources] = useState<Record<string, string>>({});
  const [context, setContext] = useState<PageContextValue>({});
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>(() => (window.innerWidth < 700 ? "phone" : "desktop"));
  const codeRef = useRef<HTMLPreElement>(null);

  const page = builtInRegistry.pages.get(activeId)!;
  // Edits are kept per language, since each language starts from its own text.
  const sourceKey = `${lang}:${activeId}`;
  const text = sources[sourceKey] ?? sourceOf(activeId, lang);
  const parsed = useMemo(() => parse(text), [text]);
  const report = useMemo(() => (parsed.value === undefined ? null : validateComposition(parsed.value, page.pageType)), [parsed.value, page.pageType]);
  // Keep showing the last page that had the right shape while the JSON is mid-edit.
  const lastGood = useRef<PageComposition | null>(null);
  const shaped = pageCompositionSchema.safeParse(parsed.value);
  if (shaped.success) lastGood.current = shaped.data;
  const composition = shaped.success ? shaped.data : lastGood.current;
  const errors = report?.issues.filter((issue) => issue.severity === "error") ?? [];

  const open = (id: string, nextContext?: PageContextValue) => {
    setActiveId(id);
    setContext(nextContext ?? initialView(builtInRegistry.pages.get(id)!).context);
  };

  const navigate = useCallback((href: string) => {
    const view = route(href);
    setActiveId(view.page.id);
    setContext(view.context);
  }, []);

  const width = DEVICES.find((item) => item.id === device)!.width;

  return (
    <div className="playground" aria-label="Playground">
      <div className="pg-bar">
        <div className="pg-files" role="tablist" aria-label="Page">
          {PAGES.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === activeId} onClick={() => open(item.id)}>
              {item.id}.json
            </button>
          ))}
        </div>
        <div className="segmented" role="group" aria-label="Preview width">
          {DEVICES.map((item) => (
            <button key={item.id} type="button" aria-pressed={device === item.id} onClick={() => setDevice(item.id)}>
              {item.label}px
            </button>
          ))}
        </div>
      </div>
      <div className="pg-body">
        <div className="pg-editor">
          <div className="editor" key={activeId}>
            <pre ref={codeRef} aria-hidden="true">
              {highlightJson(text)}
              {"\n"}
            </pre>
            <textarea
              aria-label={`${activeId} composition JSON`}
              spellCheck={false}
              value={text}
              onChange={(event) => setSources((current) => ({ ...current, [sourceKey]: event.target.value }))}
              onScroll={(event) => {
                if (codeRef.current) {
                  codeRef.current.scrollTop = event.currentTarget.scrollTop;
                  codeRef.current.scrollLeft = event.currentTarget.scrollLeft;
                }
              }}
            />
          </div>
          <div className={`pg-status ${parsed.error || errors.length ? "is-fail" : "is-pass"}`} role="status">
            {parsed.error ? (
              <span>Invalid JSON: {parsed.error}</span>
            ) : errors.length ? (
              <ul>
                {errors.slice(0, 4).map((issue, index) => (
                  <li key={index}>
                    <code>{issue.rule}</code> {issue.where && <span className="muted">{issue.where}</span>} {issue.message}
                  </li>
                ))}
              </ul>
            ) : (
              <span>
                validateComposition: valid, {report?.checks} checks
              </span>
            )}
            {sources[sourceKey] !== undefined && (
              <button type="button" className="link-btn" onClick={() => setSources(({ [sourceKey]: _, ...rest }) => rest)}>
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="pg-preview">
          <Frame scrollKey={`${activeId}-${context.productSlug ?? ""}-${context.categorySlug ?? ""}`} width={width} title={`${activeId} preview`} fill>
            {composition && (
              <LivePreview key={`${themeId}-${mode}-${dir}`} seed={seedPreviews} onNavigate={navigate}>
                <PageRenderer composition={composition} context={context} />
              </LivePreview>
            )}
          </Frame>
        </div>
      </div>
    </div>
  );
}
