import { useMemo, useState } from "react";
import { buildCatalogue, builtInRegistry, compositionOf, homeCampaign, validateComposition, type CheckReport } from "../../src";
import { CheckBadge, CheckIssues } from "./CheckResult";
import { CodeBlock } from "./CodeBlock";
import { highlightJson } from "./Highlight";

const CONFIG = JSON.stringify(
  { mcpServers: { "storefront-ui": { command: "npm", args: ["run", "--silent", "mcp"], cwd: "/path/to/storefront-ui" } } },
  null,
  2,
);

const TOOLS = [
  { name: "list_sections", text: "Sections that fit a page type, one line each." },
  { name: "get_definition", text: "Full props schema and examples for one component or section." },
  { name: "validate_page", text: "Runs the composition checker on a page before it is saved." },
  { name: "check_theme", text: "Runs the global theme checker on a theme in light and dark." },
  { name: "get_catalogue", text: "The whole catalogue, or a ~2k-token summary for a prompt." },
];

const BROKEN = {
  page: "home.ai",
  sections: [
    { section: "hero.split", props: { title: "", image: "https://cdn.example.com/hero.jpg", imageAlt: "" } },
    { section: "products.carousel", props: {} },
    { section: "header.bar" },
  ],
};

export function AgentPanel() {
  const catalogue = useMemo(() => buildCatalogue(builtInRegistry), []);
  const [text, setText] = useState(() => JSON.stringify(compositionOf(homeCampaign), null, 2));
  const [report, setReport] = useState<CheckReport | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const validate = (source = text) => {
    try {
      const value = JSON.parse(source) as unknown;
      setParseError(null);
      setReport(validateComposition(value, "home"));
    } catch (error) {
      setReport(null);
      setParseError((error as Error).message);
    }
  };

  return (
    <section className="block" id="mcp" aria-labelledby="agents-title">
      <div className="container">
      <header className="block-head">
        <h2 id="agents-title">MCP server for agents</h2>
        <p className="muted">
          Agents read the catalogue, write pages as JSON and validate them. They never write UI code, so an unknown section or a bad
          prop is caught before a shopper sees it. The full catalogue is at <code>/r/catalogue.json</code> ({catalogue.components.length}{" "}
          components, {catalogue.sections.length} sections, each with a JSON schema and examples). In a project,{" "}
          <code>buildCatalogue(registry)</code> lists only the sections you copied, so an agent reads only those.
        </p>
      </header>
      <div className="agents">
        <div className="stack">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Returns</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((tool) => (
                <tr key={tool.name}>
                  <td>
                    <code>{tool.name}</code>
                  </td>
                  <td className="muted">{tool.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <CodeBlock label="mcp.json" code={CONFIG}>
            {highlightJson(CONFIG)}
          </CodeBlock>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>validate_page</h3>
            <CheckBadge report={report} />
          </div>
          <label className="sr-only" htmlFor="composition">
            Page composition JSON
          </label>
          <textarea id="composition" className="code-input" spellCheck={false} value={text} onChange={(event) => setText(event.target.value)} rows={16} />
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => validate()}>
              Validate
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                const broken = JSON.stringify(BROKEN, null, 2);
                setText(broken);
                validate(broken);
              }}
            >
              Try a broken page
            </button>
          </div>
          {parseError && <p className="fail small">Not valid JSON: {parseError}</p>}
          {report && <CheckIssues report={report} />}
        </div>
      </div>
      </div>
    </section>
  );
}
