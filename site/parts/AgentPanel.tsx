import { useMemo, useState } from "react";
import { buildCatalogue, compositionOf, homeCampaign, validateComposition, type CheckReport } from "../../src";
import { CheckBadge, CheckIssues } from "./CheckResult";
import { CodeBlock } from "./CodeBlock";

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
  const catalogue = useMemo(() => buildCatalogue(), []);
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
    <section className="block" id="agents" aria-labelledby="agents-title">
      <div className="block-head">
        <p className="eyebrow">For AI agents</p>
        <h2 id="agents-title">Agents pick and fill. They never write UI code.</h2>
        <p className="muted">
          An agent reads the catalogue, returns a page as JSON and validates it. Everything it can say is in a schema, so a wrong
          section or a bad prop is caught before a shopper sees it.
        </p>
      </div>
      <div className="agents">
        <div className="glass panel">
          <h3>MCP tools</h3>
          <ul className="tools">
            {TOOLS.map((tool) => (
              <li key={tool.name}>
                <code>{tool.name}</code>
                <span className="muted small">{tool.text}</span>
              </li>
            ))}
          </ul>
          <CodeBlock label="Run the MCP server" code="npm run mcp" />
          <p className="muted small">
            The catalogue ships with the package: {catalogue.components.length} components and {catalogue.sections.length} sections,
            each with a JSON schema and examples, at <code>@mel-company/storefront-ui/catalogue.json</code>.
          </p>
        </div>
        <div className="glass panel">
          <div className="panel-head">
            <h3>Validate a page</h3>
            <CheckBadge report={report} />
          </div>
          <label className="sr-only" htmlFor="composition">
            Page composition JSON
          </label>
          <textarea id="composition" spellCheck={false} value={text} onChange={(event) => setText(event.target.value)} rows={14} />
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => validate()}>
              Validate
            </button>
            <button
              type="button"
              className="btn btn-ghost"
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
    </section>
  );
}
