import { z } from "zod";
import { field } from "../../core/fields";

export const toneField = field.choice("Background", ["default", "muted"], "default");
export const spacingField = field.choice("Spacing", ["normal", "tight"], "normal");

export const headingFields = {
  eyebrow: field.optionalText("Small text above the title", 40),
  title: field.text("Title", 80),
  subtitle: field.optionalText("Subtitle", 200),
};

export const columnsField = (fallback: number) =>
  z.number().int().min(2).max(5).default(fallback).describe("Columns on desktop (phones show 2)");
