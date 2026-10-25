import type { KeyboardEvent } from "react";
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

const KEYS = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];

/**
 * Single-choice chips. The first option is usually "All". A radio group with
 * one tab stop: arrow keys move along the chips (mirrored in Arabic), Space or
 * Enter picks one. Written by hand rather than on Radix Toggle Group, whose
 * arrow keys stop working when a store is portaled into an editor's iframe.
 */
export function FilterChips({ options, value, onChange, label }: FilterChipsProps) {
  const chosen = options.some((option) => option.value === value) ? value : options[0]?.value;

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!KEYS.includes(event.key)) return;
    const chips = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
    const current = chips.indexOf(event.currentTarget.ownerDocument.activeElement as HTMLButtonElement);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: 1, ArrowUp: -1 }[event.key];
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? chips.length - 1 : (Math.max(current, 0) + (step ?? 0) + chips.length) % chips.length;
    event.preventDefault();
    chips[next]?.focus();
  };

  return (
    // The radios take focus (roving tab stop), not the group, as in the WAI-ARIA radio group pattern.
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div className={styles.chips} role="radiogroup" aria-label={label} onKeyDown={move}>
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={option.value === chosen ? 0 : -1}
            className={styles.chip}
            onClick={() => {
              if (!checked) onChange(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
