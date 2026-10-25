import { useLink, useProduct, useStore } from "../../store";
import { cx } from "../../utils";
import { AddToCart } from "../AddToCart/AddToCart";
import { Badge } from "../Badge/Badge";
import { Favourite } from "../Favourite/Favourite";
import { Media, type MediaRatio } from "../Media/Media";
import { Price } from "../Price/Price";
import { Rating } from "../Rating/Rating";
import styles from "./ProductCard.module.css";
import { useMessages } from "../../i18n";

export type ProductCardVariant = "standard" | "boxed" | "overlay" | "minimal" | "horizontal";

export interface ProductCardProps {
  productId: string;
  variant?: ProductCardVariant;
  imageRatio?: MediaRatio;
  showRating?: boolean;
  showFavourite?: boolean;
  /** Quick add only shows for products with no options to choose. */
  showQuickAdd?: boolean;
  headingLevel?: 2 | 3 | 4;
}

const LOW_STOCK = 5;

export function ProductCard({
  productId,
  variant = "standard",
  imageRatio = "portrait",
  showRating = true,
  showFavourite = true,
  showQuickAdd = true,
  headingLevel = 3,
}: ProductCardProps) {
  const store = useStore();
  const Link = useLink();
  const m = useMessages();
  const product = useProduct(productId);
  if (!product) return null;

  const Heading = `h${headingLevel}` as const;
  const onSale = product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK;
  const canQuickAdd = showQuickAdd && !soldOut && !product.options?.length;

  return (
    <article
      className={cx(
        styles.card,
        variant === "boxed" && styles.boxed,
        variant === "overlay" && styles.overlay,
        variant === "minimal" && styles.minimal,
        variant === "horizontal" && styles.horizontal,
      )}
    >
      <div className={styles.mediaWrap}>
        <Media src={product.images[0] ?? ""} alt="" ratio={variant === "horizontal" ? "square" : imageRatio} />
        {variant !== "minimal" && (
          <div className={styles.badges}>
            {soldOut && <Badge>{m.soldOut}</Badge>}
            {onSale && !soldOut && <Badge tone="danger">{m.sale}</Badge>}
            {product.tags.includes("new") && !soldOut && <Badge tone="accent">{m.new}</Badge>}
          </div>
        )}
        {showFavourite && variant !== "minimal" && <Favourite productId={product.id} className={styles.favourite} />}
        {lowStock && variant !== "minimal" && variant !== "overlay" && (
          <Badge tone="warning" className={styles.stock}>
            {m.onlyLeft(product.stock)}
          </Badge>
        )}
      </div>
      <div className={styles.info}>
        <Heading className={styles.name}>
          <Link href={store.href({ to: "product", slug: product.slug })} className={styles.link}>
            {product.name}
          </Link>
        </Heading>
        {showRating && product.rating !== undefined && variant !== "minimal" && (
          <Rating value={product.rating} count={product.reviewCount} />
        )}
        <div className={styles.meta}>
          <Price amount={product.price} compareAt={product.compareAtPrice} />
          {canQuickAdd && variant !== "overlay" && (
            <span className={styles.quickAdd}>
              <AddToCart productId={product.id} compact size="sm" variant="secondary" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
