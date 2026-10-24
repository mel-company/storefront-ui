import { useId } from "react";
import { Icon } from "../../icons";
import styles from "./SearchField.module.css";
import { useMessages } from "../../i18n";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function SearchField({ value, onChange, label, placeholder }: SearchFieldProps) {
  const id = useId();
  const m = useMessages();
  return (
    <div className={styles.field} role="search">
      <label htmlFor={id} className="msu-visually-hidden">
        {label || m.searchProducts}
      </label>
      <Icon name="search" className={styles.icon} />
      <input
        id={id}
        className={styles.input}
        type="search"
        value={value}
        placeholder={placeholder || m.searchProducts}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
