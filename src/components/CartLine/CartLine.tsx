import { useCart, useLink, useStore } from "../../store";
import { Media } from "../Media/Media";
import { Price } from "../Price/Price";
import { QuantityStepper } from "../QuantityStepper/QuantityStepper";
import styles from "./CartLine.module.css";
import { useMessages } from "../../i18n";

export interface CartLineProps {
  lineKey: string;
}

export function CartLine({ lineKey }: CartLineProps) {
  const store = useStore();
  const Link = useLink();
  const m = useMessages();
  const line = useCart().lines.find((item) => item.key === lineKey);
  if (!line) return null;
  const { product } = line;
  const options = Object.values(line.options);

  return (
    <div className={styles.line}>
      <Media src={product.images[0] ?? ""} alt="" ratio="square" />
      <div className={styles.details}>
        <Link href={store.href({ to: "product", slug: product.slug })} className={styles.name}>
          {product.name}
        </Link>
        {options.length > 0 && <span className={styles.options}>{options.join(" · ")}</span>}
        <Price amount={product.price} size="sm" />
      </div>
      <div className={styles.end}>
        <QuantityStepper
          value={line.quantity}
          max={product.stock}
          label={m.quantityOf(product.name)}
          onChange={(quantity) => store.setQuantity(line.key, quantity)}
        />
        <button type="button" className={styles.remove} onClick={() => store.removeFromCart(line.key)}>
          {m.remove}<span className="msu-visually-hidden"> {product.name}</span>
        </button>
      </div>
    </div>
  );
}
