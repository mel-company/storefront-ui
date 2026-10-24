import { useEffect, useState } from "react";
import { useProduct, useStore } from "../../store";
import { Button, type ButtonSize, type ButtonVariant } from "../Button/Button";
import { useMessages } from "../../i18n";
import styles from "./AddToCart.module.css";

export interface AddToCartProps {
  productId: string;
  quantity?: number;
  options?: Record<string, string>;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Icon only, for tight cards. */
  compact?: boolean;
}

/** Adds to the real cart. Disabled when out of stock or an option is missing. */
export function AddToCart({
  productId,
  quantity = 1,
  options = {},
  label,
  variant = "primary",
  size = "md",
  fullWidth = false,
  compact = false,
}: AddToCartProps) {
  const store = useStore();
  const m = useMessages();
  const product = useProduct(productId);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (!product) return null;

  const soldOut = product.stock <= 0;
  const missing = (product.options ?? []).filter((option) => !options[option.id]);
  const disabled = soldOut || missing.length > 0;
  const text = soldOut ? m.soldOut : added ? m.added : label || m.addToCart;

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      icon={added ? "check" : "bag"}
      className={added ? styles.added : undefined}
      disabled={disabled}
      title={missing.length ? m.chooseOptions(missing.map((option) => option.name)) : undefined}
      aria-label={compact ? `${text}: ${product.name}` : undefined}
      onClick={() => {
        store.addToCart(product.id, quantity, options);
        setAdded(true);
      }}
    >
      {compact ? null : text}
    </Button>
  );
}
