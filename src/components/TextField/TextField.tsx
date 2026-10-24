import { useId, type HTMLAttributes } from "react";
import { Icon } from "../../icons";
import { cx } from "../../utils";
import styles from "./TextField.module.css";
import { useMessages } from "../../i18n";

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  type?: "text" | "tel" | "email";
  /** Several lines, for notes and addresses. */
  multiline?: boolean;
  required?: boolean;
  /** Shown under the label until there is an error. */
  hint?: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}

/** A labelled text input with a hint and an error message, both read out by screen readers. */
export function TextField({
  label,
  value,
  onChange,
  name,
  type = "text",
  multiline = false,
  required = false,
  hint,
  error,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}: TextFieldProps) {
  const id = useId();
  const m = useMessages();
  const noteId = `${id}-note`;
  const note = error || hint;
  const shared = {
    id,
    name,
    value,
    placeholder,
    autoComplete,
    maxLength,
    required,
    className: styles.control,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": note ? noteId : undefined,
  };
  return (
    <div className={cx(styles.field, error && styles.invalid)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {!required && <span className={styles.optional}> ({m.optional})</span>}
      </label>
      {multiline ? (
        <textarea rows={3} {...shared} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          type={type}
          inputMode={inputMode}
          // Phone numbers and emails read left to right in every language.
          dir={type === "text" ? undefined : "ltr"}
          {...shared}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <p id={noteId} className={styles.error}>
          <Icon name="alert" size={14} />
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
