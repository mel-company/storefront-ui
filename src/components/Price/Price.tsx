import { useFormatPrice } from "../../store";
import { cx } from "../../utils";
import styles from "./Price.module.css";
import { useMessages } from "../../i18n";

export interface PriceProps {
  amount: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Always formatted in the store's currency. Never type prices as text. */
export function Price({ amount, compareAt, size = "md", className }: PriceProps) {
  const format = useFormatPrice();
  const m = useMessages();
  const onSale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cx(styles.price, size !== "md" && styles[size], className)}>
      <span className={cx(styles.current, onSale && styles.sale)}>
        {onSale && <span className="msu-visually-hidden">{m.salePrice} </span>}
        {format(amount)}
      </span>
      {onSale && (
        <s className={styles.was}>
          <span className="msu-visually-hidden">{m.was} </span>
          {format(compareAt)}
        </s>
      )}
    </span>
  );
}
