# Storefront UI

Components, sections and pages for online stores, with the shop logic built in
(cart, stock, options, filters, bundles). People and AI agents put them
together from a schema; a checker proves every result renders, reads well in
light and dark, and works right to left. Agents never write UI code.

```
npm install @mel-company/storefront-ui
```

## Three layers

| Layer | What it is | Examples |
| --- | --- | --- |
| Component | The smallest part. Reads the store through hooks. | `commerce.addToCart`, `product.card`, `cart.freeDeliveryProgress` |
| Section | A full-width block built from components, with its own logic. | `hero.split`, `catalogue.browse`, `bundle.builder`, `product.detail` |
| Page | Sections in order, saved as plain JSON. | `home.classic`, `catalogue.default`, `cart.default` |

Every piece has a stable `id`, a one-line `description` (what an agent reads to
choose), a zod `props` schema, and examples that the checker renders.

## Use it

```tsx
import "@mel-company/storefront-ui/style.css";
import { PageRenderer, Storefront, createDemoStore, themes } from "@mel-company/storefront-ui";

const store = createDemoStore(); // or your own StoreClient

export function App() {
  return (
    <Storefront store={store} theme={themes.orchard} mode="system" dir="rtl">
      <PageRenderer
        composition={{
          page: "home.classic",
          sections: [
            { section: "header.bar", props: {} },
            { section: "hero.split", props: { title: "Skincare that feels like nothing at all", image: "https://cdn.example.com/hero.jpg", imageAlt: "Cream jar on a pink shelf" } },
            { section: "products.grid", props: { title: "Bestsellers", source: { tag: "bestseller", limit: 4 } } },
            { section: "footer.columns", props: {} },
          ],
        }}
      />
    </Storefront>
  );
}
```

`Storefront` wraps three providers you can also use on their own:
`ThemeProvider`, `StoreProvider` and `RegistryProvider`.

### Connecting a real store

Pass any object that implements `StoreClient` (`src/store/types.ts`): store
info, a `subscribe`/`getSnapshot` pair for cart and favourites, cart actions,
and `href(route)` for links. `createMemoryStore` is a complete in-memory one to
start from. Components read the store with `useProducts`, `useCart`,
`useFormatPrice` and friends, so products and prices always come from the
store, never from props.

## Theme and dark mode

A theme is a palette for light and one for dark, plus radius, density, type
scale, surface style, motion and fonts (`src/theme/schema.ts`). Presets:
`porcelain`, `noir`, `orchard`, `coral`. `ThemeProvider` writes CSS variables on
its own wrapper (never on `:root`), so several themes can sit on one page.
`mode` is `light`, `dark` or `system`.

Styles use only theme variables and logical properties (`margin-inline-start`,
not `margin-left`), so every piece works in RTL.

## Checkers

| Checker | What it checks |
| --- | --- |
| `checkTheme(theme)` | Schema, WCAG contrast for every colour pair the components draw, in light and dark; dark really is darker. |
| `checkComponent(def)` / `checkSection(def)` | Meta, examples match the schema, each example renders in light/dark × LTR/RTL, accessible names, labels, links, images, unique ids, no inline colours, sections use the components they declare, one landmark. |
| `validateComposition(page, pageType)` | Known sections, valid props, required sections, header first and footer last. Fast, no render. |
| `checkPage(page, pageType)` | The above, then a full render with exactly one `h1` and one `main`, plus every DOM rule. |
| `checkStylesheet(path, css)` | No raw colours, no physical properties. |

Run them all:

```
npm run check     # themes, 19 components, 16 sections, 5 pages × 4 themes, stylesheets
npm run verify    # typecheck + lint + tests + check
```

The landing page (`npm run dev`) runs the same checkers live in the browser,
with a theme lab, a gallery at phone, tablet and desktop widths, and a page
validator.

## For AI agents

The agent reads the catalogue, returns pages as JSON that match
`storeCompositionSchema`, and validates them before saving.

- `dist/catalogue.json` (`buildCatalogue()`): every props schema as JSON Schema,
  examples, pages, theme schema and rules.
- `catalogueSummary()`: a ~2k-token text version for a prompt.
- MCP server over stdio: `npm run mcp`.

| MCP tool | Does |
| --- | --- |
| `list_sections` | Sections that fit a page type, one line each. |
| `get_definition` | Props schema and examples for one component or section. |
| `validate_page` | Composition rules; `render: true` also runs the full page checker. |
| `check_theme` | The global theme checker on a preset or a full theme. |
| `get_catalogue` | The summary, or the full JSON catalogue. |

Add it to an MCP client:

```json
{ "mcpServers": { "storefront-ui": { "command": "npm", "args": ["run", "--silent", "mcp"], "cwd": "/path/to/storefront-ui" } } }
```

## Adding a component or section

1. Make a folder under `src/components/` or `src/sections/` with the React
   component, a `.module.css` file and `definition.tsx`.
2. `defineComponent({ id, name, description, tags, props, examples, render })`,
   or `defineSection` with `uses`, `pages` and `placement`. Build props with the
   `field` helpers so every field has a label the editor can show.
3. Add it to the folder's `index.ts` list.
4. `npm run verify`. The checker renders every example, so a new piece is
   covered the moment it is registered.

Rules: read colours only from `var(--msu-*)`, use logical CSS properties, give
every button `type` and an accessible name, and never take products or prices
as text props.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Landing page and gallery |
| `npm run build` | Library to `dist/` (ESM, types, `style.css`, `catalogue.json`) |
| `npm run build:site` | Landing page to `dist-site/` |
| `npm test` | Unit and behaviour tests |
| `npm run check` | Every checker |
| `npm run mcp` | MCP server for agents |
