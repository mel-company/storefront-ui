import * as ToggleGroup from "@radix-ui/react-toggle-group";
import styles from "./FilterChips.module.css";

export interface FilterChipOption {
  value: string;
  label: string;
}

export interface FilterChipsProps {
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

/**
 * Single-choice chips. The first option is usually "All". Built on Radix
 * Toggle Group: one tab stop, arrow keys move along the chips (mirrored in
 * Arabic), and pressing the chosen chip again keeps it chosen.
 */
/** Radix treats an empty value as "nothing chosen", so the usual "All" value ("") travels under this name. */
const EMPTY = "msu-empty";
const inner = (value: string) => value || EMPTY;

export function FilterChips({ options, value, onChange, label }: FilterChipsProps) {
  return (
    <ToggleGroup.Root
      type="single"
      className={styles.chips}
      aria-label={label}
      value={inner(value)}
      onValueChange={(next) => {
        // An empty `next` means the chosen chip was pressed again: keep it.
        if (next) onChange(next === EMPTY ? "" : next);
      }}
    >
      {options.map((option) => (
        <ToggleGroup.Item key={option.value} value={inner(option.value)} className={styles.chip}>
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
