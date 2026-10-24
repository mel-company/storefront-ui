import { z } from "zod";
import { themeSchema } from "../theme/schema";

export const sectionInstanceSchema = z.object({
  section: z.string().min(1).describe("Section id from the catalogue"),
  key: z.string().regex(/^[a-z0-9-]+$/).optional().describe("Stable key, used as anchor and editor id"),
  props: z.record(z.unknown()).default({}),
});

export const pageCompositionSchema = z.object({
  page: z.string().min(1).describe("Page id from the catalogue"),
  sections: z.array(sectionInstanceSchema).min(1).max(30),
});

/** What an AI agent returns for a whole store. */
export const storeCompositionSchema = z.object({
  theme: z.union([z.string().describe("Preset theme id"), themeSchema]),
  pages: z.object({
    home: pageCompositionSchema,
    catalogue: pageCompositionSchema.optional(),
    product: pageCompositionSchema.optional(),
    cart: pageCompositionSchema.optional(),
    checkout: pageCompositionSchema.optional(),
    confirmation: pageCompositionSchema.optional(),
    favourites: pageCompositionSchema.optional(),
    notFound: pageCompositionSchema.optional(),
  }),
});

export type SectionInstanceInput = z.input<typeof sectionInstanceSchema>;
export type PageComposition = z.infer<typeof pageCompositionSchema>;
export type PageCompositionInput = z.input<typeof pageCompositionSchema>;
export type StoreComposition = z.infer<typeof storeCompositionSchema>;
