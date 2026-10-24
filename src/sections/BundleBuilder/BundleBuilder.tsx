import { useId, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Media } from "../../components/Media/Media";
import { Price } from "../../components/Price/Price";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { useProducts, useStore } from "../../store";
import type { ProductQuery } from "../../store/types";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./BundleBuilder.module.css";
import { useMessages } from "../../i18n";

export interface BundleBuilderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  source?: ProductQuery;
  /** How many products make a set. */
  pickCount?: number;
  addLabel?: string;
  tone?: SectionTone;
}

/**
 * "Build your set": the shopper picks N in-stock products and adds them in one
 * go. Products with options are left out, because a set cannot ask for sizes.
 */
export function BundleBuilder({
  eyebrow,
  title,
  subtitle,
  source,
  pickCount = 3,
  addLabel,
  tone,
}: BundleBuilderProps) {
  const headingId = useId();
  const store = useStore();
  const m = useMessages();
  const [picked, setPicked] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const products = useProducts(source).filter((product) => product.stock > 0 && !product.options?.length);

  if (products.length < pickCount) return null;

  const chosen = picked.flatMap((id) => products.filter((product) => product.id === id));
  const total = chosen.reduce((sum, product) => sum + product.price, 0);
  const full = chosen.length === pickCount;

  const toggle = (id: string) => {
    setAdded(false);
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : current.length < pickCount ? [...current, id] : current,
    );
  };

  const addSet = () => {
    chosen.forEach((product) => store.addToCart(product.id, 1));
    setAdded(true);
    setPicked([]);
  };

  return (
    <Section labelledBy={headingId} tone={tone}>
      <SectionHeading id={headingId} eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={styles.layout}>
        <ul className={styles.options}>
          {products.map((product) => {
            const on = picked.includes(product.id);
            return (
              <li key={product.id}>
                <button
                  type="button"
                  className={styles.option}
                  aria-pressed={on}
                  disabled={!on && full}
                  onClick={() => toggle(product.id)}
                >
                  <Media src={product.images[0] ?? ""} alt="" ratio="square" />
                  <span className={styles.optionName}>{product.name}</span>
                  <Price amount={product.price} size="sm" />
                </button>
              </li>
            );
          })}
        </ul>
        <aside className={styles.summary} aria-label={m.yourSet}>
          <ul className={styles.slots}>
            {Array.from({ length: pickCount }, (_, index) => {
              const product = chosen[index];
              return <li key={index} className={styles.slot}>{product && <img src={product.images[0]} alt={product.name} />}</li>;
            })}
          </ul>
          <p className={styles.status} aria-live="polite">
            {added ? m.setAdded : full ? m.setReady : m.pickMore(pickCount - chosen.length)}
          </p>
          <p className={styles.total}>
            <span>{m.total}</span>
            <Price amount={total} size="lg" />
          </p>
          <Button fullWidth icon="bag" disabled={!full} onClick={addSet}>
            {addLabel || m.addSet}
          </Button>
        </aside>
      </div>
    </Section>
  );
}
