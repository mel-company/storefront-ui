import { z } from "zod";
import { isHexColor } from "./color";

const hex = z.string().refine(isHexColor, { message: "Use a hex colour like #1a1a1a" });

/** One colour mode. Every component reads only these roles. */
export const paletteSchema = z.object({
  background: hex.describe("Page background"),
  surface: hex.describe("Cards, panels, inputs"),
  surfaceMuted: hex.describe("Subtle bands and hover fills"),
  text: hex.describe("Main text"),
  textMuted: hex.describe("Secondary text"),
  border: hex.describe("Hairlines and outlines"),
  accent: hex.describe("Primary actions and highlights"),
  accentText: hex.describe("Text on top of the accent"),
  success: hex.describe("In stock, saved, done"),
  warning: hex.describe("Low stock, ending soon"),
  danger: hex.describe("Errors, sale prices"),
  focus: hex.describe("Keyboard focus ring"),
});

export const themeSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string().min(1),
  colors: z.object({ light: paletteSchema, dark: paletteSchema }),
  radius: z.enum(["none", "soft", "round", "pill"]).default("round"),
  density: z.enum(["compact", "normal", "spacious"]).default("normal"),
  typeScale: z.enum(["tight", "normal", "large"]).default("normal"),
  surface: z.enum(["flat", "bordered", "raised"]).default("bordered"),
  motion: z.enum(["none", "subtle", "lively"]).default("subtle"),
  fonts: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
  }),
});

export type Palette = z.infer<typeof paletteSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type ThemeInput = z.input<typeof themeSchema>;
export type ColorMode = "light" | "dark";
export type ColorModePreference = ColorMode | "system";
export type Direction = "ltr" | "rtl";

export const PALETTE_ROLES = Object.keys(paletteSchema.shape) as (keyof Palette)[];
