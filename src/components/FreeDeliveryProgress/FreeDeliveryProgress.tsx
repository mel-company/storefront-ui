import { Icon } from "../../icons";
import { useCart, useFormatPrice, useStore } from "../../store";
import { cx } from "../../utils";
import styles from "./FreeDeliveryProgress.module.css";
import { useMessages } from "../../i18n";

export interface FreeDeliveryProgressProps {
  /** `{amount}` is replaced with what is left to spend. */
  remainingText?: string;
  doneText?: string;
}

/** Live progress towards the store's free-delivery threshold. Hidden if the store has none. */
export function FreeDeliveryProgress({ remainingText, doneText }: FreeDeliveryProgressProps) {
  const m = useMessages();
  const { info } = useStore();
  const { subtotal } = useCart();
  const format = useFormatPrice();
  const threshold = info.freeDeliveryThreshold;
  if (threshold === undefined || threshold <= 0) return null;

  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const done = subtotal >= threshold;
  // An empty bar reads as broken, so an empty cart gets the offer itself instead.
  const empty = subtotal <= 0 && !remainingText;
  const text = done
    ? doneText || m.freeDeliveryDone
    : empty
      ? m.freeDeliveryOver.replace("{amount}", format(threshold))
      : (remainingText || m.freeDeliveryRemaining).replace("{amount}", format(threshold - subtotal));

  return (
    <div className={cx(styles.progress, done && styles.done)}>
      <p className={styles.message}>
        <Icon name={done ? "check" : "truck"} />
        {text}
      </p>
      {!empty && (
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={m.freeDeliveryProgress}
      >
        <div className={styles.fill} style={{ inlineSize: `${percent}%` }} />
      </div>
      )}
    </div>
  );
}
