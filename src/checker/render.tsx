import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentDefinition, Example, SectionDefinition } from "../core/define";
import type { Registry } from "../core/registry";
import { createDemoStore } from "../demo";
import { PageRenderer } from "../pages/PageRenderer";
import type { PageCompositionInput } from "../pages/composition";
import { builtInRegistry } from "../registry";
import type { PageContextValue } from "../sections/_shared/PageContext";
import { Storefront } from "../Storefront";
import type { StoreClient } from "../store/types";
import { defaultTheme } from "../theme/presets";
import type { ColorMode, Direction, Theme } from "../theme/schema";

export interface RenderOptions {
  theme?: Theme;
  mode?: ColorMode;
  dir?: Direction;
  registry?: Registry;
}

/** A fresh demo store with the example's cart already filled. */
export function previewStore(example?: Pick<Example<unknown>, "cart">): StoreClient {
  const store = createDemoStore();
  example?.cart?.forEach((line) => store.addToCart(line.productId, line.quantity, line.options));
  return store;
}

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
  const Render = definition.render;
  const props = definition.props.parse(example.props);
  return (
    <PreviewFrame store={previewStore(example)} options={options}>
      <Render {...props} />
    </PreviewFrame>
  );
}

export function pageElement(composition: PageCompositionInput, context: PageContextValue = {}, options: RenderOptions = {}) {
  return (
    <PreviewFrame store={previewStore()} options={options}>
      <PageRenderer composition={composition} context={context} />
    </PreviewFrame>
  );
}

/** Static HTML of an element. Effects do not run, which is what a first paint looks like. */
export const toHtml = (element: ReactElement): string => renderToStaticMarkup(element);
