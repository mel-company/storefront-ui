import { useFormatPrice } from "../../store";
import { cx } from "../../utils";
import styles from "./Price.module.css";

export interface PriceProps {
  amount: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Always formatted in the store's currency. Never type prices as text. */
export function Price({ amount, compareAt, size = "md", className }: PriceProps) {
  const format = useFormatPrice();
  const onSale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cx(styles.price, size !== "md" && styles[size], className)}>
      <span className={cx(styles.current, onSale && styles.sale)}>
        {onSale && <span className="msu-visually-hidden">Sale price </span>}
        {format(amount)}
      </span>
      {onSale && (
        <s className={styles.was}>
          <span className="msu-visually-hidden">Was </span>
          {format(compareAt)}
        </s>
      )}
    </span>
  );
}
