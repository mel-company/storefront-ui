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
    <section className="block" id="themes" aria-labelledby="themes-title">
      <div className="block-head">
        <p className="eyebrow">Global theme checker</p>
        <h2 id="themes-title">One theme, two modes, every colour pair checked</h2>
        <p className="muted">
          Components read only theme variables. The checker tests the pairs they actually draw against WCAG AA, in light and in dark.
          Try breaking it.
        </p>
      </div>
      <div className="theme-lab">
        <div className="glass panel">
          <div className="panel-head">
            <div className="segmented" role="group" aria-label="Mode to edit">
              {(["light", "dark"] as const).map((value) => (
                <button key={value} type="button" aria-pressed={editMode === value} onClick={() => setEditMode(value)}>
                  {value === "light" ? "Light palette" : "Dark palette"}
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
          <table className="contrast">
            <thead>
              <tr>
                <th scope="col">Pair</th>
                <th scope="col">Ratio</th>
                <th scope="col">Needs</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rule}>
                  <td>
                    {row.fg} on {row.bg}
                  </td>
                  <td>{row.ratio.toFixed(2)}</td>
                  <td>{row.min}</td>
                  <td className={row.pass ? "pass" : "fail"}>{row.pass ? "Pass" : "Fail"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!report.ok && <CheckIssues report={report} />}
          <button type="button" className="btn btn-ghost small" onClick={() => setDraft(base)}>
            Reset colours
          </button>
        </div>
        <div className="glass panel lab-preview">
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
    </section>
  );
}
