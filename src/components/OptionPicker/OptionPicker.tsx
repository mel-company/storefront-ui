import { useId } from "react";
import type { ProductOption } from "../../store/types";
import styles from "./OptionPicker.module.css";

export interface OptionPickerProps {
  option: ProductOption;
  value: string | undefined;
  onChange: (value: string) => void;
}

/** A radio group styled as chips. Arrow keys move between values. */
export function OptionPicker({ option, value, onChange }: OptionPickerProps) {
  const name = useId();
  return (
    <fieldset className={styles.picker}>
      <legend className={styles.legend}>
        {option.name}
        {value ? `: ${value}` : ""}
      </legend>
      <div className={styles.values}>
        {option.values.map((item) => (
          <label key={item} className={styles.value}>
            <input type="radio" name={name} value={item} checked={value === item} onChange={() => onChange(item)} />
            <span className={styles.chip}>{item}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
