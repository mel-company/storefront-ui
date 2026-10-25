import { Icon } from "../../icons";
import { useCategories, useLink, useStore } from "../../store";
import { cx } from "../../utils";
import { containerClassName } from "../_shared/Section";
import styles from "./FooterColumns.module.css";
import { useMessages } from "../../i18n";

export interface FooterColumnsProps {
  about?: string;
  /** Shown after the year, e.g. "All rights reserved." */
  legal?: string;
  /** columns: brand and three link columns. centered: everything on the middle line. minimal: one slim row. */
  layout?: "columns" | "centered" | "minimal";
  /** muted is a soft band, plain the page background, inverted the text colour. */
  tone?: "muted" | "plain" | "inverted";
  /** The store name very large across the bottom. */
  bigName?: boolean;
}

/** Categories, help links, contact and social from the store's own settings. Once per page, last. */
export function FooterColumns({ about, legal, layout = "columns", tone = "muted", bigName = false }: FooterColumnsProps) {
  const store = useStore();
  const Link = useLink();
  const m = useMessages();
  const categories = useCategories();
  const { contact, social, name } = store.info;

  const socialLinks = (social?.instagram || contact?.whatsapp) && (
    <div className={styles.social}>
      {social?.instagram && (
        <a className={styles.socialLink} href={social.instagram} aria-label="Instagram" rel="noreferrer" target="_blank">
          <Icon name="instagram" size={18} />
        </a>
      )}
      {contact?.whatsapp && (
        <a className={styles.socialLink} href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} aria-label="WhatsApp" rel="noreferrer" target="_blank">
          <Icon name="chat" size={18} />
        </a>
      )}
    </div>
  );
  const copyright = (
    <p className={cx(styles.bottom, styles.muted)}>
      © {new Date().getFullYear()} {name}. {legal || m.rightsReserved}
    </p>
  );
  const big = bigName && (
    <p className={styles.bigName} aria-hidden="true">
      {name}
    </p>
  );
  const className = cx(styles.footer, styles[layout], tone !== "muted" && styles[tone]);

  if (layout !== "columns") {
    // One line of the main links: all products, the categories, and order tracking.
    return (
      <footer className={className}>
        <div className={containerClassName}>
          <div className={styles.line}>
            <p className={styles.name}>{name}</p>
            {layout === "centered" && about && <p className={styles.muted}>{about}</p>}
            <nav aria-label={m.shop}>
              <ul className={styles.inlineList}>
                <li>
                  <Link href={store.href({ to: "catalogue" })}>{m.allProducts}</Link>
                </li>
                {categories.slice(0, layout === "minimal" ? 3 : 6).map((category) => (
                  <li key={category.id}>
                    <Link href={store.href({ to: "category", slug: category.slug })}>{category.name}</Link>
                  </li>
                ))}
                {store.trackOrder && (
                  <li>
                    <Link href={store.href({ to: "tracking" })}>{m.trackOrder}</Link>
                  </li>
                )}
              </ul>
            </nav>
            {socialLinks}
          </div>
          {layout === "centered" && (contact?.phone || contact?.email) && (
            <ul className={cx(styles.inlineList, styles.contactLine)}>
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
              )}
            </ul>
          )}
          {big}
          {copyright}
        </div>
      </footer>
    );
  }

  return (
    <footer className={className}>
      <div className={containerClassName}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.name}>{name}</p>
            {about && <p className={styles.muted}>{about}</p>}
            {socialLinks}
          </div>
          <nav className={styles.column} aria-labelledby="msu-footer-shop">
            <h2 id="msu-footer-shop">{m.shop}</h2>
            <ul className={styles.list}>
              <li>
                <Link href={store.href({ to: "catalogue" })}>{m.allProducts}</Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={store.href({ to: "category", slug: category.slug })}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className={styles.column} aria-labelledby="msu-footer-help">
            <h2 id="msu-footer-help">{m.help}</h2>
            <ul className={styles.list}>
              <li>
                <Link href={store.href({ to: "cart" })}>{m.cart}</Link>
              </li>
              <li>
                <Link href={store.href({ to: "favourites" })}>{m.favourites}</Link>
              </li>
              {store.trackOrder && (
                <li>
                  <Link href={store.href({ to: "tracking" })}>{m.trackOrder}</Link>
                </li>
              )}
            </ul>
          </nav>
          {contact && (
            <div className={styles.column}>
              <h2>{m.contact}</h2>
              <ul className={styles.list}>
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
                {contact.address && <li className={styles.muted}>{contact.address}</li>}
              </ul>
            </div>
          )}
        </div>
        {big}
        {copyright}
      </div>
    </footer>
  );
}
