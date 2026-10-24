import { useId, type ReactNode } from "react";
import { cx } from "../../utils";
import { Icon, type IconName } from "../../icons";
import styles from "./RadioCards.module.css";

export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  icon?: IconName;
}

export interface RadioCardsProps {
  legend: ReactNode;
  legendClassName?: string;
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
}

/** One choice from a few, each a card with a line of detail. Arrow keys move between them. */
export function RadioCards({ legend, legendClassName, options, value, onChange }: RadioCardsProps) {
  const name = useId();
  return (
    <fieldset className={styles.group}>
      <legend className={cx(styles.legend, legendClassName)}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.text}>
            <span className={styles.label}>{option.label}</span>
            {option.description && <span className={styles.description}>{option.description}</span>}
          </span>
          {option.icon && <Icon name={option.icon} className={styles.icon} />}
        </label>
      ))}
    </fieldset>
  );
}
