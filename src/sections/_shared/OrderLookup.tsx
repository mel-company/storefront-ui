import { useState, type FormEvent } from "react";
import { Button } from "../../components/Button/Button";
import { TextField } from "../../components/TextField/TextField";
import { useMessages } from "../../i18n";
import { Icon, type IconName } from "../../icons";
import styles from "./OrderLookup.module.css";

export interface OrderQuery {
  number: string;
  phone: string;
}

export interface OrderLookupProps {
  initialNumber?: string;
  submitLabel: string;
  busyLabel: string;
  submitIcon?: IconName;
  /** Text for when the store cannot look orders up. */
  offText: string;
  /** Absent = the store cannot look orders up. Resolves `false` when nothing matched. */
  onFind?: (query: OrderQuery) => Promise<boolean>;
}

type Status = "idle" | "searching" | "notFound" | "failed" | "off";

/** Order number and phone, checked, then handed to `onFind`. Shared by tracking and invoices. */
export function OrderLookup({ initialNumber = "", submitLabel, busyLabel, submitIcon = "search", offText, onFind }: OrderLookupProps) {
  const m = useMessages();
  const [number, setNumber] = useState(initialNumber);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ number?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const found = {
      number: number.trim() ? undefined : m.required,
      phone: !phone.trim() ? m.required : digits.length < 7 || digits.length > 15 ? m.invalidPhone : undefined,
    };
    setErrors(found);
    if (found.number || found.phone) return;
    if (!onFind) {
      setStatus("off");
      return;
    }
    setStatus("searching");
    try {
      setStatus((await onFind({ number: number.trim(), phone: phone.trim() })) ? "idle" : "notFound");
    } catch {
      setStatus("failed");
    }
  };

  const searching = status === "searching";
  const alert = status === "notFound" ? m.orderNotFound : status === "off" ? offText : status === "failed" ? m.orderFailed : null;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={searching || undefined}>
      {alert && (
        <p className={styles.alert} role="alert">
          <Icon name="alert" size={18} />
          {alert}
        </p>
      )}
      <div className={styles.pair}>
        <TextField
          label={m.orderNumberLabel}
          name="order"
          inputMode="numeric"
          autoComplete="off"
          required
          hint={m.orderNumberHint}
          value={number}
          onChange={(value) => {
            setNumber(value);
            if (errors.number) setErrors((current) => ({ ...current, number: undefined }));
          }}
          error={errors.number}
          maxLength={40}
        />
        <TextField
          label={m.phone}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          hint={m.orderPhoneHint}
          value={phone}
          onChange={(value) => {
            setPhone(value);
            if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
          }}
          error={errors.phone}
          maxLength={20}
        />
      </div>
      <Button type="submit" size="lg" icon={searching ? undefined : submitIcon} disabled={searching}>
        {searching ? busyLabel : submitLabel}
      </Button>
    </form>
  );
}
