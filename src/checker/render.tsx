import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentDefinition, Example, SectionDefinition } from "../core/define";
import type { Registry } from "../core/registry";
import { createDemoStore, demoProducts } from "../demo";
import type { Language } from "../i18n/messages";
import { PageRenderer } from "../pages/PageRenderer";
import type { PageCompositionInput } from "../pages/composition";
import { builtInRegistry } from "../registry";
import { PageContextProvider, type PageContextValue } from "../sections/_shared/PageContext";
import { Storefront } from "../Storefront";
import type { StoreClient } from "../store/types";
import { defaultTheme } from "../theme/presets";
import type { ColorMode, Direction, Theme } from "../theme/schema";

export interface RenderOptions {
  theme?: Theme;
  mode?: ColorMode;
  dir?: Direction;
  registry?: Registry;
  /** Demo store language. Defaults to Arabic for `rtl` and English for `ltr`. */
  language?: Language;
  /** Render the skeleton (sections) or every section's skeleton (pages). */
  skeleton?: boolean;
}

/** An English option value (e.g. `30 ml`) as the same value in the given store's products. */
function localOptions(store: StoreClient, productId: string, options: Record<string, string> = {}) {
  const source = demoProducts.find((product) => product.id === productId);
  const target = store.getSnapshot().products.find((product) => product.id === productId);
  return Object.fromEntries(
    Object.entries(options).map(([id, value]) => {
      const index = source?.options?.find((option) => option.id === id)?.values.indexOf(value) ?? -1;
      return [id, target?.options?.find((option) => option.id === id)?.values[index] ?? value];
    }),
  );
}

/** Puts an example's cart into a store, in that store's language. */
export function fillCart(store: StoreClient, cart: Example<unknown>["cart"] = []) {
  cart.forEach((line) => store.addToCart(line.productId, line.quantity, localOptions(store, line.productId, line.options)));
}

/** Puts an example's cart and favourites into a store. */
export function seedExample(store: StoreClient, example?: Pick<Example<unknown>, "cart" | "favourites">) {
  fillCart(store, example?.cart);
  example?.favourites?.forEach((id) => store.toggleFavourite(id));
}

/** A fresh demo store with the example's cart and favourites already filled. */
export function previewStore(example?: Pick<Example<unknown>, "cart" | "favourites">, language: Language = "en"): StoreClient {
  const store = createDemoStore({ language });
  seedExample(store, example);
  return store;
}

const languageFor = (options: RenderOptions): Language => options.language ?? (options.dir === "rtl" ? "ar" : "en");

export function PreviewFrame({ store, options, children }: { store: StoreClient; options: RenderOptions; children: ReactElement }) {
  return (
    <Storefront
      store={store}
      theme={options.theme ?? defaultTheme}
      mode={options.mode ?? "light"}
      dir={options.dir ?? "ltr"}
      registry={options.registry ?? builtInRegistry}
    >
      {children}
    </Storefront>
  );
}

export function exampleElement(
  definition: ComponentDefinition | SectionDefinition,
  example: Example<unknown>,
  options: RenderOptions = {},
): ReactElement {
  const Render = (options.skeleton && definition.kind === "section" && definition.skeleton) || definition.render;
  const props = definition.props.parse(example.props);
  return (
    <PreviewFrame store={previewStore(example, languageFor(options))} options={options}>
      <PageContextProvider value={example.context ?? {}}>
        <Render {...props} />
      </PageContextProvider>
    </PreviewFrame>
  );
}

export function pageElement(
  composition: PageCompositionInput,
  context: PageContextValue = {},
  options: RenderOptions & { preview?: Pick<Example<unknown>, "cart" | "favourites"> } = {},
) {
  return (
    <PreviewFrame store={previewStore(options.preview, languageFor(options))} options={options}>
      <PageRenderer composition={composition} context={context} loading={options.skeleton} />
    </PreviewFrame>
  );
}

/** Static HTML of an element. Effects do not run, which is what a first paint looks like. */
export const toHtml = (element: ReactElement): string => renderToStaticMarkup(element);
