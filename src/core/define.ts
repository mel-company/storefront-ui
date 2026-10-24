import type { ComponentType } from "react";
import type { z } from "zod";

export type PageType = "home" | "catalogue" | "product" | "cart" | "any";

export interface Example<Props> {
  name: string;
  props: Props;
  /** Products put in the preview store's cart before this example renders. */
  cart?: { productId: string; quantity: number; options?: Record<string, string> }[];
}

interface BaseDefinition<Schema extends z.ZodTypeAny> {
  /** `family.name`, e.g. `product.card`. Stable: agents and saved stores use it. */
  id: string;
  name: string;
  /** One line on when to use it. This is what an AI agent reads to choose. */
  description: string;
  tags: string[];
  props: Schema;
  /** At least one. Each is rendered and checked by the checker. */
  examples: Example<z.input<Schema>>[];
  render: ComponentType<z.output<Schema>>;
}

export interface ComponentDefinition<Schema extends z.ZodTypeAny = z.ZodTypeAny>
  extends BaseDefinition<Schema> {
  kind: "component";
}

export interface SectionDefinition<Schema extends z.ZodTypeAny = z.ZodTypeAny>
  extends BaseDefinition<Schema> {
  kind: "section";
  /** Component ids this section is built from. The checker holds it to that. */
  uses: string[];
  /** Pages this section belongs on. */
  pages: PageType[];
  /** Header and footer sit once per page, first and last. */
  placement?: "header" | "footer" | "body";
}

export interface SectionInstance {
  section: string;
  /** Optional stable id, used as the anchor and the editor key. */
  key?: string;
  props?: Record<string, unknown>;
}

export interface PageDefinition {
  kind: "page";
  id: string;
  name: string;
  description: string;
  pageType: Exclude<PageType, "any">;
  /** Section ids that must appear on every page of this type. */
  requires: string[];
  /** The starting layout. Agents may reorder, swap and add body sections. */
  sections: SectionInstance[];
}

export type AnyDefinition = ComponentDefinition | SectionDefinition | PageDefinition;

const ID = /^[a-z][a-z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/;

function assertId(id: string) {
  if (!ID.test(id)) throw new Error(`Invalid id "${id}": use family.name, e.g. product.card`);
}

export function defineComponent<Schema extends z.ZodTypeAny>(
  definition: Omit<ComponentDefinition<Schema>, "kind">,
): ComponentDefinition<Schema> {
  assertId(definition.id);
  return { kind: "component", ...definition };
}

export function defineSection<Schema extends z.ZodTypeAny>(
  definition: Omit<SectionDefinition<Schema>, "kind">,
): SectionDefinition<Schema> {
  assertId(definition.id);
  return { kind: "section", placement: "body", ...definition };
}

export function definePage(definition: Omit<PageDefinition, "kind">): PageDefinition {
  assertId(definition.id);
  return { kind: "page", ...definition };
}
