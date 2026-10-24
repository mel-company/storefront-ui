import { Icon } from "../../icons";
import { useFavourites, useProduct } from "../../store";
import { cx } from "../../utils";
import styles from "./Favourite.module.css";
import { useMessages } from "../../i18n";

export interface FavouriteProps {
  productId: string;
  className?: string;
}

export function Favourite({ productId, className }: FavouriteProps) {
  const product = useProduct(productId);
  const { isFavourite, toggle } = useFavourites();
  const m = useMessages();
  if (!product) return null;
  const on = isFavourite(product.id);
  return (
    <button
      type="button"
      className={cx(styles.favourite, on && styles.on, className)}
      aria-pressed={on}
      aria-label={on ? m.removeFavourite(product.name) : m.saveFavourite(product.name)}
      onClick={() => toggle(product.id)}
    >
      <Icon name="heart" size={18} filled={on} />
    </button>
  );
}
