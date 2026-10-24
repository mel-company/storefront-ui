import { z } from "zod";
import { ICON_NAMES, type IconName } from "../icons";

/**
 * Field helpers. Each one is a zod schema whose `.describe()` text is the
 * human label, so the same schema gives the AI its JSON schema, the editor its
 * settings panel, and the checker its validation.
 */
export const field = {
  text: (label: string, max = 80) => z.string().trim().min(1).max(max).describe(label),
  optionalText: (label: string, max = 160) => z.string().trim().max(max).optional().describe(label),
  longText: (label: string, max = 600) => z.string().trim().min(1).max(max).describe(label),
  image: (label: string) =>
    z
      .string()
      .min(1)
      .refine((value) => /^(https?:\/\/|data:image\/|\/|\.\/)/.test(value), "Use an absolute URL, a path or a data: image")
      .describe(label),
  count: (label: string, min: number, max: number, fallback: number) =>
    z.number().int().min(min).max(max).default(fallback).describe(label),
  flag: (label: string, fallback: boolean) => z.boolean().default(fallback).describe(label),
  choice: <const T extends readonly [string, ...string[]]>(label: string, values: T, fallback: T[number]) =>
    z.enum(values).default(fallback).describe(label),
  /** ISO date-time, e.g. `2026-11-01T00:00:00+03:00`. */
  dateTime: (label: string) => z.string().datetime({ offset: true }).describe(label),
};

export const routeSchema = z
  .discriminatedUnion("to", [
    z.object({ to: z.literal("home") }),
    z.object({
      to: z.literal("catalogue"),
      query: z
        .object({ categoryId: z.string().optional(), tag: z.string().optional(), search: z.string().optional() })
        .optional(),
    }),
    z.object({ to: z.literal("category"), slug: z.string().min(1) }),
    z.object({ to: z.literal("product"), slug: z.string().min(1) }),
    z.object({ to: z.literal("cart") }),
    z.object({ to: z.literal("checkout") }),
    z.object({ to: z.literal("favourites") }),
    z.object({ to: z.literal("tracking"), number: z.string().optional() }),
    z.object({ to: z.literal("url"), href: z.string().url() }),
  ])
  .describe("Where the link goes");

export const actionSchema = z
  .object({ label: field.text("Button label", 32), route: routeSchema })
  .describe("A call to action");

/** Which products a section shows. Real data, never typed-in products. */
export const productSourceSchema = z
  .object({
    categoryId: z.string().optional().describe("Only this category"),
    tag: z.string().optional().describe("Only products with this tag"),
    onSale: z.boolean().optional().describe("Only discounted products"),
    maxPrice: z.number().positive().optional().describe("Only products at or below this price"),
    ids: z.array(z.string()).max(24).optional().describe("Hand-picked product ids, in order"),
    sort: z.enum(["featured", "price-asc", "price-desc", "rating", "newest"]).default("featured"),
    limit: z.number().int().min(1).max(48).default(8),
  })
  .default({})
  .describe("Which products to show");

export const iconSchema = z.enum(ICON_NAMES as [IconName, ...IconName[]]).describe("Icon name");
