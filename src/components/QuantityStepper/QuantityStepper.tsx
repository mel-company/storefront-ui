import { useRef } from "react";
import { Icon } from "../../icons";
import styles from "./QuantityStepper.module.css";
import { useMessages } from "../../i18n";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** What is being counted, for screen readers. */
  label?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, label }: QuantityStepperProps) {
  const m = useMessages();
  // Bump the number when it changes, not when the stepper first shows.
  const first = useRef(value);
  return (
    <div className={styles.stepper} role="group" aria-label={label || m.quantity}>
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={m.decrease}
      >
        <Icon name="minus" size={16} />
      </button>
      <output className={styles.value} aria-live="polite">
        <span key={value} className={value !== first.current ? styles.bump : undefined}>
          {value}
        </span>
      </output>
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={m.increase}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
