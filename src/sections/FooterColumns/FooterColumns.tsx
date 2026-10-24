import { Icon } from "../../icons";
import { useCategories, useLink, useStore } from "../../store";
import { containerClassName } from "../_shared/Section";
import styles from "./FooterColumns.module.css";

export interface FooterColumnsProps {
  about?: string;
  /** Shown after the year, e.g. "All rights reserved." */
  legal?: string;
}

/** Categories, help links, contact and social from the store's own settings. Once per page, last. */
export function FooterColumns({ about, legal = "All rights reserved." }: FooterColumnsProps) {
  const store = useStore();
  const Link = useLink();
  const categories = useCategories();
  const { contact, social, name } = store.info;

  return (
    <footer className={styles.footer}>
      <div className={containerClassName}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.name}>{name}</p>
            {about && <p className={styles.muted}>{about}</p>}
            {social && (
              <div className={styles.social}>
                {social.instagram && (
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
            )}
          </div>
          <nav className={styles.column} aria-labelledby="msu-footer-shop">
            <h2 id="msu-footer-shop">Shop</h2>
            <ul className={styles.list}>
              <li>
                <Link href={store.href({ to: "catalogue" })}>All products</Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={store.href({ to: "category", slug: category.slug })}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className={styles.column} aria-labelledby="msu-footer-help">
            <h2 id="msu-footer-help">Help</h2>
            <ul className={styles.list}>
              <li>
                <Link href={store.href({ to: "cart" })}>Cart</Link>
              </li>
              <li>
                <Link href={store.href({ to: "favourites" })}>Favourites</Link>
              </li>
            </ul>
          </nav>
          {contact && (
            <div className={styles.column}>
              <h2>Contact</h2>
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
        <p className={`${styles.bottom} ${styles.muted}`}>
          © {new Date().getFullYear()} {name}. {legal}
        </p>
      </div>
    </footer>
  );
}
