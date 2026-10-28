# Storefront UI

Components, sections and pages for online stores, with the shop logic built in
(cart, stock, options, filters, bundles). People and AI agents put them
together from a schema; a checker proves every result renders, reads well in
light and dark, and works right to left. Agents never write UI code.

```
npm install @mel-company/storefront-ui
npx storefront-ui add header.bar hero.split products.grid footer.columns
```

The package is only the core: theme, the store contract, text in English and
Arabic, icons, the define/registry helpers and the renderers (about 25 KB). The
components and sections are copied into your project as source, like shadcn/ui,
so you ship and your agent reads only the ones you use, and you can change them.

## Three layers

| Layer | What it is | Examples |
| --- | --- | --- |
| Component | The smallest part. Reads the store through hooks. | `commerce.addToCart`, `product.card`, `cart.freeDeliveryProgress` |
| Section | A full-width block built from components, with its own logic. | `hero.split`, `catalogue.browse`, `bundle.builder`, `product.detail` |
| Page | Sections in order, saved as plain JSON. | `home.classic`, `catalogue.default`, `cart.default`, `checkout.default` |

Every piece has a stable `id`, a one-line `description` (what an agent reads to
choose), a zod `props` schema, and examples that the checker renders.

## Add pieces

```
npx storefront-ui list                       # every component and section
npx storefront-ui add hero.split products.grid
```

`add` writes each piece with the files it needs into `src/storefront-ui/`
(`--dir` to change it; remembered in `storefront-ui.json`), keeping the
library's layout so shared files are written once. Imports of the core point
at the package. It then rewrites `registry.ts` (every copied definition) and
`index.ts` (every copied component) in that folder, and prints any npm package
a piece needs, e.g. `@radix-ui/react-select` for `form.select`.

Code that Node's ESM resolver loads (a server importing the copies) needs
explicit extensions: `--js-extensions` writes `./Button.js` and
`./Button/index.js` in relative imports.

Copies are yours to edit. Running `add` again updates files you have not
changed and keeps the ones you have (`--overwrite` replaces them). Pieces come
from https://storefront-ui-x.vercel.app/r by default; `--registry` takes
another URL or a local folder made by `npm run registry`.

## Use it

```tsx
import "@mel-company/storefront-ui/style.css";
import { PageRenderer, Storefront, themes } from "@mel-company/storefront-ui";
import { createDemoStore } from "@mel-company/storefront-ui/demo";
import { registry } from "./storefront-ui";

const store = createDemoStore(); // or your own StoreClient

export function App() {
  return (
    <Storefront store={store} registry={registry} theme={themes.orchard} mode="system" dir="rtl">
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

The whole journey is covered: home, catalogue (pass `search` in the page
context for search results), product, cart, checkout, order confirmation,
favourites, page not found, order tracking and invoices. To take orders, add `placeOrder(order)` to your
store. The checkout form checks the fields, sends the customer, payment choice,
cart lines and totals, and then shows the order number, or sends the shopper to
`redirectUrl` when you return one (an online payment page, for example). Without
`placeOrder` it says ordering is not set up. `info.checkout` sets the city list,
the payment methods and whether to ask for an email.

For order tracking, add `trackOrder(query)` and return the order's status,
history, items and courier, or `null`. The query is the order number plus
either the phone it was placed with or `key`, the order's access key. Return an
`accessKey` from `placeOrder`: the confirmation's tracking and invoice links
carry it (`?order=1042&key=…`, read into the page context as `orderNumber` and
`orderKey`), so those pages open straight away without asking for the phone.
For a signed-in shopper, return the order for the number alone when your
session owns it. Only when nothing matches do the pages show the number and
phone form, so an order number alone never shows anything. The footer and the order
confirmation link to tracking only when the store has `trackOrder`.

For invoices, add `getInvoice(query)` (same query and rule). The
invoice page and the tracked order then show the invoice with **Print**, which
prints only the invoice, and **Download PDF**, which draws an A4 PDF in the
browser (pages break between rows), or opens `invoice.pdfUrl` when your server
makes its own. `info.invoice` adds the logo, legal name, address, tax number, a
closing note and the design: `classic`, `modern` or `compact` on A4, or
`receipt80` / `receipt58` for thermal receipt printers (a narrow black-on-white
slip that prints on a roll exactly as long as the receipt, and downloads as a
PDF of the same size). The `order.invoice` section's `template` prop overrides
it, and `InvoiceView` renders any invoice directly (a till or a dashboard). The invoice is always light, follows RTL, and every label can be
renamed through `info.messages`.

### Loading skeletons

Every section has a skeleton: its real layout as soft placeholder shapes, read
from the same props (columns, card style, image side, tone), so nothing jumps
when the data arrives. Pass `loading` while products, the cart or an order
load:

```tsx
<PageRenderer composition={page} loading={!ready} />
<SectionRenderer section="products.grid" props={props} loading />
```

The page keeps one `<main>`, marked `aria-busy`, and each section is a busy
region named "Loading…" in the store's language. The shimmer runs on the
theme's motion, so `motion: "none"` and reduced motion keep it still. Custom
sections add `skeleton` to `defineSection`, built from `Skeleton` (the
`ui.skeleton` component); the checker requires one and renders it.

### Drawers, dropdowns and other interactive pieces

The pieces with tricky keyboard and screen reader behaviour are built on
[Radix](https://www.radix-ui.com/primitives) primitives, styled with the
library's own CSS (no Tailwind needed):

| Piece | Radix primitive | What it adds |
| --- | --- | --- |
| `Drawer` (`ui.drawer`), header mobile menu | Dialog | Focus stays inside, Escape and the backdrop close it, page scroll locks, focus returns to the button |
| `SelectField` (`form.select`), `SelectMenu`, catalogue sort | Select | Themed list with arrow keys and type-to-find; `native` keeps the browser's own select |
| `Accordion` (`ui.accordion`) | Accordion | Arrow keys between questions, smooth open and close; closed answers stay in the HTML |
| `FilterChips` (`catalogue.categoryChips`) | none (own code) | Radio group with one tab stop, arrow keys along the chips |

`ThemeProvider` passes its direction to Radix, so arrow keys and slide-in sides
mirror in Arabic stores. Popups render inside the provider's wrapper
(`usePortalContainer()`), so they keep the theme, colour mode and direction.
A copied piece that uses Radix needs that Radix package installed (`add` names
it); the core itself only uses `@radix-ui/react-direction`. React stays a peer.

### Hosts: React versions, frames and direction

- Works with React 18 and 19. React, react-dom (also `react-dom/server`,
  used by the checkers) and every dependency stay external in the build, so
  the host's React is the only copy.
- `Storefront` picks the direction from the store's locale (`ar-IQ` gives
  `rtl`); pass `dir` to override.
- Hosts that render the store from their own page into an iframe through a
  React portal (an editor canvas, a preview) are supported: there Radix reads
  the parent page's `window`, `document` and `Node`, so the library adds back
  what that breaks (dropdowns closing on the first click, outside presses,
  Tab staying inside a drawer). See `src/theme/framed.ts`.

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
npm run check     # themes, 26 components, 22 sections, 11 pages × 4 themes, stylesheets
npm run verify    # typecheck + lint + tests + check
```

The landing page (`npm run dev`) runs the same checkers live in the browser,
with a theme lab, a gallery at phone, tablet and desktop widths, and a page
validator. Its docs pages (`/components`, `/sections`, `/pages`, live at
https://storefront-ui-x.vercel.app/components) show every piece with a preview,
React code, a props table, its JSON and its source files.

## For AI agents

The agent reads the catalogue, returns pages as JSON that match
`storeCompositionSchema`, and validates them before saving.

- `buildCatalogue(registry)`: every props schema in your copied registry as
  JSON Schema, with examples, the theme schema and rules. Built from your
  registry, so an agent sees only the sections the project has.
- `catalogueSummary(registry)`: a short text version for a prompt.
- The whole library's catalogue, for choosing what to add:
  https://storefront-ui-x.vercel.app/r/catalogue.json (and `catalogue.md`).
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
   covered the moment it is registered, and `tests/registry-copy` copies every
   section with `add` and checks the copy renders the same.

A piece may import the core (`src/core`, `theme`, `store`, `i18n`, `icons`,
`pages`, `utils.ts`) and other components and `sections/_shared`; anything
the core uses must be exported from `src/package.ts`, or `npm run registry`
fails. Demo data (`src/demo`) is the `/demo` entry.

Rules: read colours only from `var(--msu-*)`, use logical CSS properties, give
every button `type` and an accessible name, and never take products or prices
as text props.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Landing page, gallery and docs |
| `npm run build` | The core package to `dist/` (ESM, CommonJS, types, `style.css`, and the `/demo` entry) |
| `npm run registry` | The copy-in registry and full catalogue to `site/public/r/` |
| `npm run build:site` | Registry, then landing page and docs to `dist-site/` |
| `npm test` | Unit and behaviour tests |
| `npm run check` | Every checker |
| `npm run mcp` | MCP server for agents |

## Releasing

1. Bump `version` in `package.json` (semver: a new section or variant is a minor, a removed prop is a major).
2. `npm publish`. `prepublishOnly` runs `npm run verify` and `npm run build` first, so a release with a failing check or test is refused.
