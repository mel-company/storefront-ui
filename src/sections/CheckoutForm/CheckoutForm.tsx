import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { Button, ButtonLink } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Media } from "../../components/Media/Media";
import { RadioCards, type RadioCardOption } from "../../components/RadioCards/RadioCards";
import { SelectField } from "../../components/SelectField/SelectField";
import { TextField } from "../../components/TextField/TextField";
import { Icon } from "../../icons";
import { useCart, useFormatPrice, useStore, useStoreSnapshot } from "../../store";
import type { CheckoutCustomer, OrderResult } from "../../store/types";
import { OrderPlaced } from "../OrderConfirmation/OrderConfirmation";
import { Section, type SectionTone } from "../_shared/Section";
import { cx } from "../../utils";
import styles from "./CheckoutForm.module.css";
import { useMessages, type Messages } from "../../i18n";

export interface CheckoutFormProps {
  title?: string;
  placeOrderLabel?: string;
  showBreadcrumbs?: boolean;
  showNotes?: boolean;
  /** Numbered circles before each group. */
  showSteps?: boolean;
  /** `grid` puts payment methods side by side on wider screens. */
  paymentLayout?: "list" | "grid";
  /** On phones, show the order summary above the form instead of under it. */
  summaryFirst?: boolean;
  tone?: SectionTone;
  /** Shown once the order is placed. */
  successTitle?: string;
  successText?: string;
}

type Values = Required<CheckoutCustomer>;
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "failed" | "off";

const EMPTY: Values = { name: "", phone: "", email: "", city: "", address: "", notes: "" };

const ORDER: (keyof Values)[] = ["name", "phone", "email", "city", "address", "notes"];

function validate(values: Values, email: "off" | "optional" | "required", m: Messages): Errors {
  const errors: Errors = {};
  const required = (key: keyof Values) => {
    if (!values[key].trim()) errors[key] = m.required;
  };
  required("name");
  required("city");
  required("address");
  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) errors.phone = m.required;
  else if (digits.length < 7 || digits.length > 15) errors.phone = m.invalidPhone;
  if (email === "required" && !values.email.trim()) errors.email = m.required;
  else if (email !== "off" && values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = m.invalidEmail;
  return errors;
}

/**
 * The checkout page: contact, delivery and payment, with the order summary
 * beside it. Sends the order through `store.placeOrder`, then thanks the
 * shopper in place, or goes to the platform's payment page. Holds the page's h1.
 */
export function CheckoutForm({
  title,
  placeOrderLabel,
  showBreadcrumbs = true,
  showNotes = true,
  showSteps = true,
  paymentLayout = "list",
  summaryFirst = false,
  tone,
  successTitle,
  successText,
}: CheckoutFormProps) {
  const headingId = useId();
  const store = useStore();
  const snapshot = useStoreSnapshot();
  const cart = useCart();
  const format = useFormatPrice();
  const m = useMessages();
  const formRef = useRef<HTMLFormElement>(null);
  const settings = store.info.checkout ?? {};
  const emailMode = settings.email ?? "off";
  const payments: RadioCardOption[] = (
    settings.payments?.length ? settings.payments : [{ id: "cash", label: m.cashOnDelivery, description: m.cashOnDeliveryText }]
  ).map((method) => ({
    value: method.id,
    label: method.label,
    description: method.description,
    icon: method.id === "cash" ? "cash" : method.id === "card" ? "card" : undefined,
  }));

  const [values, setValues] = useState<Values>(EMPTY);
  const [payment, setPayment] = useState(payments[0]!.value);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<OrderResult | null>(null);

  // After a failed submit, take the shopper to the first field to fix.
  useEffect(() => {
    if (!submitted) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [submitted]);

  const set = (key: keyof Values) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as it is edited.
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  if (result) {
    return (
      <Section labelledBy={headingId} tone={tone}>
        <OrderPlaced orderNumber={result.number ?? result.id} orderKey={result.accessKey} title={successTitle} text={successText} headingId={headingId} />
      </Section>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <Section labelledBy={headingId} tone={tone}>
        <EmptyState
          icon="bag"
          headingLevel={1}
          headingId={headingId}
          title={m.cartEmptyTitle}
          text={m.cartEmptyText}
          actions={<ButtonLink route={{ to: "catalogue" }}>{m.startShopping}</ButtonLink>}
        />
      </Section>
    );
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values, emailMode, m);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      setSubmitted((count) => count + 1);
      return;
    }
    if (!store.placeOrder) {
      setStatus("off");
      return;
    }
    setStatus("sending");
    const customer: CheckoutCustomer = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      address: values.address.trim(),
      ...(values.email.trim() ? { email: values.email.trim() } : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    };
    try {
      const placed = await store.placeOrder({
        customer,
        payment,
        lines: snapshot.cart,
        subtotal: cart.subtotal,
        delivery: cart.delivery,
        total: cart.total,
      });
      if (placed.redirectUrl) {
        window.location.assign(placed.redirectUrl);
        return;
      }
      setResult(placed);
    } catch {
      setStatus("failed");
    }
  };

  const errorCount = ORDER.filter((key) => errors[key]).length;
  const sending = status === "sending";

  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={styles.head}>
        {showBreadcrumbs && <Breadcrumbs items={[{ label: m.cart, route: { to: "cart" } }, { label: title || m.checkout }]} />}
        <h1 id={headingId} className={styles.title}>
          {title || m.checkout}
        </h1>
      </div>
      <form ref={formRef} className={cx(styles.layout, summaryFirst && styles.summaryFirst)} onSubmit={onSubmit} noValidate aria-busy={sending || undefined}>
        <div className={styles.fields}>
          {(errorCount > 0 || status === "failed" || status === "off") && (
            <p className={styles.alert} role="alert">
              <Icon name="alert" size={18} />
              {errorCount > 0 ? m.fixErrors(errorCount) : status === "off" ? m.orderingOff : m.orderFailed}
            </p>
          )}
          <fieldset className={styles.group}>
            <legend className={styles.legend}>
              {showSteps && (
                <span className={styles.step} aria-hidden="true">
                  1
                </span>
              )}
              {m.contactDetails}
            </legend>
            <TextField label={m.fullName} name="name" autoComplete="name" required value={values.name} onChange={set("name")} error={errors.name} maxLength={80} />
            <div className={emailMode === "off" ? undefined : styles.pair}>
              <TextField
                label={m.phone}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={values.phone}
                onChange={set("phone")}
                error={errors.phone}
                maxLength={20}
              />
              {emailMode !== "off" && (
                <TextField
                  label={m.email}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required={emailMode === "required"}
                  value={values.email}
                  onChange={set("email")}
                  error={errors.email}
                  maxLength={120}
                />
              )}
            </div>
          </fieldset>
          <fieldset className={styles.group}>
            <legend className={styles.legend}>
              {showSteps && (
                <span className={styles.step} aria-hidden="true">
                  2
                </span>
              )}
              {m.deliveryDetails}
            </legend>
            {settings.cities?.length ? (
              <SelectField
                label={m.city}
                name="city"
                options={settings.cities}
                placeholder={m.chooseCity}
                required
                value={values.city}
                onChange={set("city")}
                error={errors.city}
              />
            ) : (
              <TextField label={m.city} name="city" autoComplete="address-level2" required value={values.city} onChange={set("city")} error={errors.city} maxLength={60} />
            )}
            <TextField
              label={m.address}
              name="address"
              autoComplete="street-address"
              required
              hint={m.addressHint}
              value={values.address}
              onChange={set("address")}
              error={errors.address}
              maxLength={200}
            />
            {showNotes && <TextField label={m.notes} name="notes" multiline hint={m.notesHint} value={values.notes} onChange={set("notes")} maxLength={300} />}
          </fieldset>
          <div className={styles.group}>
            <RadioCards
              legendClassName={styles.legend}
              legend={
                <>
                  {showSteps && (
                <span className={styles.step} aria-hidden="true">
                  3
                </span>
              )}
                  {m.payment}
                </>
              }
              options={payments}
              layout={paymentLayout}
              value={payment}
              onChange={setPayment}
            />
          </div>
        </div>

        <aside className={styles.summary} aria-label={m.orderSummary}>
          <h2 className={styles.summaryTitle}>{m.orderSummary}</h2>
          <ul className={styles.items}>
            {cart.lines.map((line) => {
              const options = Object.values(line.options);
              return (
                <li key={line.key} className={styles.item}>
                  <span className={styles.thumb}>
                    <Media src={line.product.images[0] ?? ""} alt="" ratio="square" />
                    <span className={styles.qty}>
                      <span className="msu-visually-hidden">{m.quantity}: </span>
                      {line.quantity}
                    </span>
                  </span>
                  <span className={styles.itemName}>
                    {line.product.name}
                    {options.length > 0 && <span className={styles.itemOptions}>{options.join(" · ")}</span>}
                  </span>
                  <span>{format(line.total)}</span>
                </li>
              );
            })}
          </ul>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>{m.subtotal}</dt>
              <dd>{format(cart.subtotal)}</dd>
            </div>
            <div className={styles.row}>
              <dt>{m.delivery}</dt>
              <dd>{cart.delivery === 0 ? m.free : format(cart.delivery)}</dd>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <dt>{m.total}</dt>
              <dd>{format(cart.total)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" fullWidth disabled={sending} icon={sending ? undefined : "check"}>
            {sending ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                {m.placingOrder}
              </>
            ) : (
              placeOrderLabel || m.placeOrder
            )}
          </Button>
        </aside>
      </form>
    </Section>
  );
}
