import { useId } from "react";
import { Icon } from "../../icons";
import { cx } from "../../utils";
import field from "../TextField/TextField.module.css";
import styles from "./SelectField.module.css";
import { useMessages } from "../../i18n";

export interface SelectFieldProps {
  label: string;
  options: (string | { value: string; label: string })[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  /** First, empty choice, e.g. "Choose a city". */
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  autoComplete?: string;
}

/** A labelled native select, styled to match the text field. Native so phones show their own picker. */
export function SelectField({ label, options, value, onChange, name, placeholder, required = false, hint, error, autoComplete }: SelectFieldProps) {
  const id = useId();
  const m = useMessages();
  const noteId = `${id}-note`;
  const note = error || hint;
  return (
    <div className={cx(field.field, error && field.invalid)}>
      <label htmlFor={id} className={field.label}>
        {label}
        {!required && <span className={field.optional}> ({m.optional})</span>}
      </label>
      <div className={styles.wrap}>
        <select
          id={id}
          name={name}
          value={value}
          required={required}
          autoComplete={autoComplete}
          className={cx(field.control, styles.select)}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? noteId : undefined}
          onChange={(event) => onChange(event.target.value)}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((option) => {
            const item = typeof option === "string" ? { value: option, label: option } : option;
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        <Icon name="chevronDown" size={18} className={styles.chevron} />
      </div>
      {error ? (
        <p id={noteId} className={field.error}>
          <Icon name="alert" size={14} />
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className={field.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
