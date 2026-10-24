import { Icon, type IconName } from "../../icons";
import { useFormatDate } from "../../store";
import type { OrderStatus as Status } from "../../store/types";
import { cx } from "../../utils";
import styles from "./OrderSteps.module.css";
import { useMessages } from "../../i18n";

const FLOW: Status[] = ["placed", "confirmed", "shipped", "outForDelivery", "delivered"];

const ICONS: Record<Status, IconName> = {
  placed: "bag",
  confirmed: "box",
  shipped: "truck",
  outForDelivery: "pin",
  delivered: "home",
  cancelled: "close",
};

export interface OrderStepsProps {
  status: Status;
  /** When each status was reached, ISO date-time. */
  history?: Partial<Record<Status, string>>;
  /** `horizontal` runs across on wider screens; phones always stack. */
  layout?: "horizontal" | "vertical";
  showDates?: boolean;
}

/** Where an order is: placed, confirmed, shipped, out for delivery, delivered. A cancelled order ends at the step it reached. */
export function OrderSteps({ status, history = {}, layout = "horizontal", showDates = true }: OrderStepsProps) {
  const m = useMessages();
  const formatDate = useFormatDate();
  const cancelled = status === "cancelled";
  // A cancelled order shows the steps it got through, then the cancellation.
  const reached = cancelled ? FLOW.filter((step) => history[step]) : FLOW.slice(0, FLOW.indexOf(status) + 1);
  const steps: Status[] = cancelled ? [...(reached.length ? reached : ["placed" as const]), "cancelled"] : FLOW;
  const currentIndex = cancelled ? steps.length - 1 : FLOW.indexOf(status);

  return (
    <ol className={cx(styles.steps, layout === "horizontal" && styles.horizontal)} aria-label={m.orderProgress}>
      {steps.map((step, index) => {
        const state =
          step === "cancelled" ? "cancelled" : index < currentIndex || status === "delivered" ? "done" : index === currentIndex ? "current" : "upcoming";
        const at = history[step];
        return (
          <li key={step} className={cx(styles.step, styles[state])} aria-current={index === currentIndex ? "step" : undefined}>
            <span className={styles.dot}>
              <Icon name={state === "done" ? "check" : ICONS[step]} size={18} />
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{m.orderStatus[step]}</span>
              {showDates && at && <span className={styles.date}>{formatDate(at, true)}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
