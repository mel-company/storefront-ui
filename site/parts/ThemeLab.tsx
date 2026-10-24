import { useEffect, useMemo, useState } from "react";
import {
  checkTheme,
  contrastTable,
  createDemoStore,
  PALETTE_ROLES,
  ProductCard,
  StoreProvider,
  ThemeProvider,
  ButtonLink,
  type ColorMode,
  type Palette,
  type Theme,
} from "../../src";
import { useSettings } from "../settings";
import { CheckBadge, CheckIssues } from "./CheckResult";

const EDITABLE: (keyof Palette)[] = ["background", "surface", "text", "textMuted", "accent", "accentText"];

/** The global theme checker, live: edit colours and watch contrast pass or fail. */
export function ThemeLab() {
  const { theme: base, mode } = useSettings();
  const [draft, setDraft] = useState<Theme>(base);
  const [editMode, setEditMode] = useState<ColorMode>(mode);
  const [store] = useState(createDemoStore);

  useEffect(() => setDraft(base), [base]);
  useEffect(() => setEditMode(mode), [mode]);

  const report = useMemo(() => checkTheme(draft), [draft]);
  const rows = useMemo(() => contrastTable(draft.colors[editMode]), [draft, editMode]);

  const setColor = (role: keyof Palette, value: string) =>
    setDraft((current) => ({ ...current, colors: { ...current.colors, [editMode]: { ...current.colors[editMode], [role]: value } } }));

  return (
    <section className="block" id="theming" aria-labelledby="themes-title">
      <div className="container">
      <header className="block-head">
        <h2 id="themes-title">Theming</h2>
        <p className="muted">
          A theme is a light palette, a dark palette and a few scales. Components read only theme variables, and{" "}
          <code>checkTheme</code> tests every colour pair they draw against WCAG AA in both modes. Click a swatch to change a colour and see the checker react.
        </p>
      </header>
      <div className="theme-lab">
        <div className="panel">
          <div className="panel-head">
            <div className="segmented" role="group" aria-label="Mode to edit">
              {(["light", "dark"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={editMode === value} onClick={() => setEditMode(value)}>
                  {value === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
            <CheckBadge report={report} />
          </div>
          <div className="swatches">
            {PALETTE_ROLES.map((role) => {
              const editable = EDITABLE.includes(role);
              const value = draft.colors[editMode][role];
              return (
                <label key={role} className="swatch">
                  <span className="swatch-color" style={{ background: value }}>
                    {editable && <input type="color" value={value} onChange={(event) => setColor(role, event.target.value)} aria-label={`${role} colour`} />}
                  </span>
                  <span className="small">{role}</span>
                  <code className="small">{value}</code>
                </label>
              );
            })}
          </div>
          <table className="table contrast">
            <thead>
              <tr>
                <th scope="col">Pair</th>
                <th scope="col" className="num">Ratio</th>
                <th scope="col" className="num">Needs</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rule}>
                  <td>
                    {row.fg} on {row.bg}
                  </td>
                  <td className="num">{row.ratio.toFixed(2)}</td>
                  <td className="num">{row.min}</td>
                  <td className={row.pass ? "pass" : "fail"}>{row.pass ? "pass" : "fail"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!report.ok && <CheckIssues report={report} />}
          <button type="button" className="btn btn-sm" onClick={() => setDraft(base)}>
            Reset colours
          </button>
        </div>
        <div className="panel lab-preview">
          <ThemeProvider theme={draft} mode={editMode}>
            <StoreProvider store={store}>
              <div className="lab-sample">
                <ProductCard productId="p1" variant="boxed" imageRatio="square" />
                <ProductCard productId="p2" variant="boxed" imageRatio="square" />
              </div>
              <div className="lab-actions">
                <ButtonLink route={{ to: "catalogue" }}>Primary</ButtonLink>
                <ButtonLink route={{ to: "cart" }} variant="secondary">
                  Secondary
                </ButtonLink>
              </div>
            </StoreProvider>
          </ThemeProvider>
        </div>
      </div>
      </div>
    </section>
  );
}
