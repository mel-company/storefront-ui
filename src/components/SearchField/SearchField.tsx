import { useId } from "react";
import { Icon } from "../../icons";
import styles from "./SearchField.module.css";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function SearchField({ value, onChange, label = "Search products", placeholder = "Search products" }: SearchFieldProps) {
  const id = useId();
  return (
    <div className={styles.field} role="search">
      <label htmlFor={id} className="msu-visually-hidden">
        {label}
      </label>
      <Icon name="search" className={styles.icon} />
      <input
        id={id}
        className={styles.input}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
