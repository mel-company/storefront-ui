import { createContext, useContext, type ReactNode } from "react";
import type { Registry } from "../core/registry";
import { PageContextProvider, type PageContextValue } from "../sections/_shared/PageContext";
import type { PageCompositionInput } from "./composition";

const RegistryContext = createContext<Registry | null>(null);

export function RegistryProvider({ registry, children }: { registry: Registry; children: ReactNode }) {
  return <RegistryContext.Provider value={registry}>{children}</RegistryContext.Provider>;
}

export function useRegistry(): Registry {
  const registry = useContext(RegistryContext);
  if (!registry) throw new Error("Wrap pages in <RegistryProvider> (or use <Storefront>)");
  return registry;
}

export interface SectionRendererProps {
  section: string;
  props?: Record<string, unknown>;
}

/**
 * Renders one section from data. Props go through the section's schema, so
 * defaults apply and bad data is dropped instead of reaching a component.
 */
export function SectionRenderer({ section, props = {} }: SectionRendererProps) {
  const registry = useRegistry();
  const definition = registry.sections.get(section);
  if (!definition) {
    if (import.meta.env?.DEV) console.warn(`[storefront-ui] Unknown section "${section}"`);
    return null;
  }
  const parsed = definition.props.safeParse(props);
  if (!parsed.success) {
    if (import.meta.env?.DEV) console.warn(`[storefront-ui] Invalid props for "${section}"`, parsed.error.issues);
    return null;
  }
  const Render = definition.render;
  return <Render {...parsed.data} />;
}

export interface PageRendererProps {
  composition: PageCompositionInput;
  context?: PageContextValue;
}

/** A page from data: header first, body sections in `<main>`, footer last. */
export function PageRenderer({ composition, context = {} }: PageRendererProps) {
  const registry = useRegistry();
  const placed = composition.sections.map((instance, index) => ({
    instance,
    index,
    placement: registry.sections.get(instance.section)?.placement ?? "body",
  }));
  const render = (items: typeof placed) =>
    items.map(({ instance, index }) => (
      <div key={instance.key ?? `${instance.section}-${index}`} id={instance.key} data-msu-section={instance.section}>
        <SectionRenderer section={instance.section} props={instance.props} />
      </div>
    ));

  return (
    <PageContextProvider value={context}>
      {render(placed.filter((item) => item.placement === "header"))}
      <main>{render(placed.filter((item) => item.placement === "body"))}</main>
      {render(placed.filter((item) => item.placement === "footer"))}
    </PageContextProvider>
  );
}

/** A page definition's starting layout as a composition. */
export const compositionOf = (page: { id: string; sections: PageCompositionInput["sections"] }): PageCompositionInput => ({
  page: page.id,
  sections: page.sections,
});
