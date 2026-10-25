import * as Select from "@radix-ui/react-select";
import { useId } from "react";
import { Icon } from "../../icons";
import { usePortalContainer } from "../../theme/ThemeProvider";
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
  /** Use the browser's own select, so phones show their built-in picker. */
  native?: boolean;
}

/**
 * A labelled dropdown styled to match the text field. Built on Radix Select:
 * the open list follows the theme, colour mode and direction, and supports
 * arrow keys and type-to-find. Set `native` for the browser's own select.
 */
export function SelectField({
  label,
  options,
  value,
  onChange,
  name,
  placeholder,
  required = false,
  hint,
  error,
  autoComplete,
  native = false,
}: SelectFieldProps) {
  const id = useId();
  const m = useMessages();
  const items = options.map((option) => (typeof option === "string" ? { value: option, label: option } : option));
  const noteId = `${id}-note`;
  const note = error || hint;
  return (
    <div className={cx(field.field, error && field.invalid)}>
      <label htmlFor={id} className={field.label}>
        {label}
        {!required && <span className={field.optional}> ({m.optional})</span>}
      </label>
      {native ? (
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
            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={18} className={styles.chevron} />
        </div>
      ) : (
        <SelectMenu
          id={id}
          items={items}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={field.control}
          invalid={Boolean(error)}
          describedBy={note ? noteId : undefined}
        />
      )}
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

export interface SelectMenuProps {
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  /** Pair with a `<label htmlFor>`, or pass `aria-label`. */
  id?: string;
  "aria-label"?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  invalid?: boolean;
  describedBy?: string;
  /** Classes for the closed button. */
  className?: string;
}

/** The Radix dropdown on its own, for places with their own label, like a "Sort by" row. */
export function SelectMenu({
  items,
  value,
  onChange,
  id,
  name,
  placeholder,
  required,
  autoComplete,
  invalid,
  describedBy,
  className,
  "aria-label": ariaLabel,
}: SelectMenuProps) {
  const container = usePortalContainer();
  return (
    <Select.Root value={value} onValueChange={onChange} name={name} required={required} autoComplete={autoComplete}>
      <Select.Trigger
        id={id}
        className={cx(styles.trigger, className)}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      >
        <span className={styles.value}>
          {/* The label is given here so it is in the server HTML too, not only after the list mounts. */}
          <Select.Value placeholder={placeholder}>{items.find((item) => item.value === value)?.label}</Select.Value>
        </span>
        <Select.Icon className={styles.icon}>
          <Icon name="chevronDown" size={18} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal container={container}>
        <Select.Content className={styles.content} position="popper" sideOffset={6} collisionPadding={12}>
          <Select.ScrollUpButton className={styles.scroll}>
            <Icon name="chevronDown" size={16} className={styles.up} />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            {items.map((item) => (
              <Select.Item key={item.value} value={item.value} className={styles.item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.check}>
                  <Icon name="check" size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.scroll}>
            <Icon name="chevronDown" size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
