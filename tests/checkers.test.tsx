import { z } from "zod";
import {
  builtInRegistry,
  checkComponent,
  checkDom,
  checkPage,
  checkStylesheet,
  checkTheme,
  defineComponent,
  defineSection,
  checkSection,
  homeClassic,
  themes,
  validateComposition,
} from "../src";

const parse = (html: string) => new DOMParser().parseFromString(html, "text/html");
const dom = (html: string) => {
  const root = parse(`<div class="msu-root">${html}</div>`).querySelector(".msu-root");
  if (!root) throw new Error("no root");
  return checkDom(root, "test").issues.map((issue) => issue.rule);
};

describe("theme checker", () => {
  it("passes every preset in light and dark", () => {
    for (const theme of Object.values(themes)) expect(checkTheme(theme).issues).toEqual([]);
  });

  it("flags low contrast and names the mode", () => {
    const theme = structuredClone(themes.porcelain);
    theme.colors.dark.textMuted = "#3a3f4a";
    const report = checkTheme(theme);
    expect(report.ok).toBe(false);
    expect(report.issues.some((issue) => issue.rule === "contrast.muted-on-background" && issue.where === "dark")).toBe(true);
  });

  it("flags a dark mode that is lighter than light mode", () => {
    const theme = structuredClone(themes.porcelain);
    theme.colors.dark = { ...theme.colors.light };
    theme.colors.light = { ...themes.porcelain.colors.dark };
    expect(checkTheme(theme).issues.map((issue) => issue.rule)).toContain("mode.dark-is-darker");
  });

  it("rejects a theme with a bad colour", () => {
    const theme = structuredClone(themes.porcelain) as { colors: { light: { text: string } } };
    theme.colors.light.text = "black";
    expect(checkTheme(theme).issues[0]?.rule).toBe("schema");
  });
});

describe("DOM rules", () => {
  it("passes clean markup", () => {
    expect(dom('<button type="button">Add</button><a href="#/cart">Cart</a><img src="x.png" alt="">')).toEqual([]);
  });

  it("flags unnamed buttons and links, missing alt, missing href", () => {
    const rules = dom('<button type="button"></button><a href="#/x"></a><a>Nowhere</a><img src="x.png">');
    expect(rules).toEqual(expect.arrayContaining(["a11y.button-name", "a11y.link-name", "a11y.link-href", "a11y.img-alt"]));
  });

  it("flags nested controls, unlabeled inputs, duplicate ids and raw colours", () => {
    const rules = dom(
      '<a href="#/a">Card <button type="button">Buy</button></a><input type="text"><p id="x">a</p><p id="x">b</p><p style="color: #ff0000">hi</p>',
    );
    expect(rules).toEqual(
      expect.arrayContaining(["a11y.nested-interactive", "a11y.input-label", "a11y.duplicate-id", "style.inline-color"]),
    );
  });

  it("flags an empty render", () => {
    expect(dom("")).toContain("render.empty");
  });
});

describe("component checker", () => {
  it("catches an example that breaks its own schema", () => {
    const definition = defineComponent({
      id: "test.broken",
      name: "Broken",
      description: "A component whose example does not match its props.",
      tags: ["test"],
      props: z.object({ title: z.string().min(1) }),
      examples: [{ name: "Bad", props: { title: "" } }],
      render: function Broken({ title }) {
        return <p>{title}</p>;
      },
    });
    expect(checkComponent(definition, { parse }).issues[0]?.rule).toBe("schema.example");
  });

  it("catches a component that throws or renders an icon button with no name", () => {
    const definition = defineComponent({
      id: "test.icon",
      name: "Icon",
      description: "A component that renders an unnamed icon button.",
      tags: ["test"],
      props: z.object({}),
      examples: [{ name: "Default", props: {} }],
      render: function NoName() {
        return (
          <button type="button">
            <svg aria-hidden="true" />
          </button>
        );
      },
    });
    expect(checkComponent(definition, { parse }).issues.map((issue) => issue.rule)).toContain("a11y.button-name");
  });

  it("passes every built-in component", () => {
    for (const definition of builtInRegistry.components.values()) {
      expect(checkComponent(definition, { parse }).issues, definition.id).toEqual([]);
    }
  });
});

describe("composition checker", () => {
  const ok = { page: "home.classic", sections: homeClassic.sections };

  it("accepts a built-in page", () => {
    expect(validateComposition(ok, "home").ok).toBe(true);
  });

  it("rejects unknown sections, bad props and missing chrome", () => {
    const report = validateComposition(
      { page: "home.ai", sections: [{ section: "hero.split", props: { title: "" } }, { section: "hero.spinning" }] },
      "home",
    );
    const rules = report.issues.map((issue) => issue.rule);
    expect(rules).toEqual(expect.arrayContaining(["composition.props", "composition.unknown-section", "composition.required"]));
  });

  it("rejects a footer that is not last", () => {
    const sections = [...homeClassic.sections];
    const footer = sections.pop()!;
    sections.splice(1, 0, footer);
    expect(validateComposition({ page: "home.classic", sections }, "home").issues.map((i) => i.rule)).toContain("composition.chrome-order");
  });

  it("flags two heroes on one page as two h1s", () => {
    const hero = homeClassic.sections[1]!;
    const sections = [homeClassic.sections[0]!, hero, { ...hero, key: "hero-2" }, homeClassic.sections.at(-1)!];
    const report = checkPage({ page: "home.classic", sections }, "home", { parse });
    expect(report.issues.map((issue) => issue.rule)).toContain("page.h1");
  });
});

describe("stylesheet checker", () => {
  it("flags raw colours and physical properties", () => {
    const issues = checkStylesheet("x.css", ".a {\n  color: #fff;\n  margin-left: 4px;\n  padding-inline-start: 4px;\n  background: var(--msu-surface);\n}");
    expect(issues.map((issue) => `${issue.rule}@${issue.where}`)).toEqual(["style.raw-color@x.css:2", "style.physical-property@x.css:3"]);
  });
});

describe("skeletons", () => {
  const base = {
    id: "demo.block",
    name: "Demo block",
    description: "A test section that only shows a heading and a line.",
    tags: ["test"],
    uses: [],
    pages: ["home" as const],
    props: z.object({ title: z.string().default("Hello") }),
    examples: [{ name: "Default", props: {} }],
    render: ({ title }: { title: string }) => (
      <section aria-label={title}>
        <h2>{title}</h2>
      </section>
    ),
  };

  it("requires every section to have one", () => {
    const report = checkSection(defineSection(base), { parse });
    expect(report.issues.map((issue) => issue.rule)).toContain("section.skeleton");
  });

  it("flags a skeleton that is not marked busy or has a button", () => {
    const report = checkSection(
      defineSection({
        ...base,
        skeleton: () => (
          <section aria-label="Loading">
            <button type="button">Wait</button>
          </section>
        ),
      }),
      { parse },
    );
    const rules = report.issues.map((issue) => issue.rule);
    expect(rules).toContain("skeleton.busy");
    expect(rules).toContain("skeleton.interactive");
  });

  it("gives every built-in section a passing skeleton", () => {
    for (const section of builtInRegistry.sections.values()) {
      expect(section.skeleton, section.id).toBeDefined();
      expect(checkSection(section, { parse }).issues.filter((issue) => issue.rule.startsWith("skeleton") || issue.where?.startsWith("skeleton")), section.id).toEqual([]);
    }
  });

  it("renders a whole page as skeletons, still with one main", () => {
    expect(checkPage({ page: homeClassic.id, sections: homeClassic.sections }, "home", { parse }).ok).toBe(true);
  });
});
