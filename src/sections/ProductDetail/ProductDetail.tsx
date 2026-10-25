import { useId, useState } from "react";
import { Accordion, type AccordionItem } from "../../components/Accordion/Accordion";
import { AddToCart } from "../../components/AddToCart/AddToCart";
import { Badge } from "../../components/Badge/Badge";
import { Favourite } from "../../components/Favourite/Favourite";
import { Media } from "../../components/Media/Media";
import { OptionPicker } from "../../components/OptionPicker/OptionPicker";
import { Price } from "../../components/Price/Price";
import { QuantityStepper } from "../../components/QuantityStepper/QuantityStepper";
import { Rating } from "../../components/Rating/Rating";
import { useProduct } from "../../store";
import { cx } from "../../utils";
import { usePageContext } from "../_shared/PageContext";
import { Section } from "../_shared/Section";
import styles from "./ProductDetail.module.css";
import { useMessages } from "../../i18n";

export interface ProductDetailProps {
  /** Defaults to the product the page is about. */
  productId?: string;
  details?: AccordionItem[];
  stickyBuyBar?: boolean;
  lowStockAt?: number;
  /** thumbsBelow / thumbsSide: one big image and a strip of thumbnails. grid / stack: every image at once on desktop, a swipe row on phones. */
  gallery?: "thumbsBelow" | "thumbsSide" | "grid" | "stack";
  imageRatio?: "square" | "portrait";
  /** Which side the gallery takes on desktop. */
  gallerySide?: "start" | "end";
}

/** The product page's main block: gallery, name, price, options, quantity, add to cart. Holds the page's h1. */
export function ProductDetail({
  productId,
  details = [],
  stickyBuyBar = true,
  lowStockAt = 5,
  gallery = "thumbsBelow",
  imageRatio = "square",
  gallerySide = "start",
}: ProductDetailProps) {
  const headingId = useId();
  const page = usePageContext();
  const m = useMessages();
  const product = useProduct(productId ?? page.productSlug);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [chosen, setOptions] = useState<Record<string, string>>({});

  if (!product) return null;

  // Each option starts on its first value, so Add to cart works straight away.
  const options = { ...Object.fromEntries((product.options ?? []).map((option) => [option.id, option.values[0] ?? ""])), ...chosen };

  const image = product.images[imageIndex] ?? product.images[0] ?? "";
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= lowStockAt;

  return (
    <Section labelledBy={headingId}>
      <div className={cx(styles.detail, gallerySide === "end" && styles.galleryEnd)}>
        {gallery === "grid" || gallery === "stack" ? (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable so keyboard users can swipe it on phones
          <div className={cx(styles.gallery, styles.all, gallery === "grid" && styles.allGrid)} tabIndex={0} role="region" aria-label={product.name}>
            {product.images.map((src, index) => (
              <Media key={src} src={src} alt={index === 0 ? product.name : ""} ratio={imageRatio} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className={cx(styles.gallery, gallery === "thumbsSide" && product.images.length > 1 && styles.side)}>
            <Media src={image} alt={product.name} ratio={imageRatio} priority className={styles.main} />
            {product.images.length > 1 && (
              <ul className={styles.thumbs}>
                {product.images.map((src, index) => (
                  <li key={src}>
                    <button
                      type="button"
                      className={styles.thumb}
                      aria-current={index === imageIndex}
                      aria-label={m.showImage(index + 1)}
                      onClick={() => setImageIndex(index)}
                    >
                      <Media src={src} alt="" ratio={imageRatio} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className={cx(styles.info, (gallery === "grid" || gallery === "stack") && styles.stickyInfo)}>
          {product.tags.includes("new") && <Badge tone="accent">{m.new}</Badge>}
          <h1 id={headingId} className={styles.title}>
            {product.name}
          </h1>
          {product.rating !== undefined && <Rating value={product.rating} count={product.reviewCount} />}
          <div className={styles.priceRow}>
            <Price amount={product.price} compareAt={product.compareAtPrice} size="lg" />
            <p className={cx(styles.stock, soldOut ? styles.out : low ? styles.low : styles.inStock)}>
              {soldOut ? m.soldOut : low ? m.onlyLeft(product.stock) : m.inStock}
            </p>
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.purchase}>
          {product.options?.map((option) => (
            <OptionPicker
              key={option.id}
              option={option}
              value={options[option.id]}
              onChange={(value) => setOptions((current) => ({ ...current, [option.id]: value }))}
            />
          ))}
          <div className={styles.buy}>
            {!soldOut && <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />}
            <span className={styles.grow}>
              <AddToCart productId={product.id} quantity={quantity} options={options} size="lg" fullWidth />
            </span>
            <Favourite productId={product.id} />
          </div>
          </div>
          {details.length > 0 && <Accordion items={details} single={false} />}
        </div>
      </div>
      {stickyBuyBar && !soldOut && (
        <div className={styles.sticky}>
          <Price amount={product.price} compareAt={product.compareAtPrice} />
          <span className={styles.grow}>
            <AddToCart productId={product.id} quantity={quantity} options={options} fullWidth />
          </span>
        </div>
      )}
    </Section>
  );
}
