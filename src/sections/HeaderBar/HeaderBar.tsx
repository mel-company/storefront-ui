import { useId, useRef, useState } from "react";
import { Icon } from "../../icons";
import { useCart, useCategories, useFavourites, useLink, useStore } from "../../store";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import { containerClassName } from "../_shared/Section";
import styles from "./HeaderBar.module.css";
import { useMessages } from "../../i18n";

export interface HeaderLink {
  label: string;
  route: Route;
}

export interface HeaderBarProps {
  layout?: "classic" | "centered";
  /** Leave empty to list the store's categories. */
  links?: HeaderLink[];
  announcement?: string;
  showSearch?: boolean;
  showFavourites?: boolean;
}

/** Store name, navigation, search, favourites and the live cart count. Mobile menu below 900px. */
export function HeaderBar({ layout = "classic", links, announcement, showSearch = true, showFavourites = true }: HeaderBarProps) {
  const store = useStore();
  const Link = useLink();
  const m = useMessages();
  const categories = useCategories();
  const { count } = useCart();
  const favourites = useFavourites();
  const [open, setOpen] = useState(false);
  const drawerId = useId();

  const items: HeaderLink[] =
    links && links.length > 0
      ? links
      : [
          { label: m.shopAll, route: { to: "catalogue" } },
          ...categories.slice(0, 4).map((category) => ({ label: category.name, route: { to: "category", slug: category.slug } as Route })),
        ];

  return (
    <header className={cx(styles.header, styles[layout])}>
      {announcement && <p className={styles.announcement}>{announcement}</p>}
      <div className={containerClassName}>
        <div className={styles.bar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={drawerId}
            aria-label={open ? m.closeMenu : m.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
          <Link href={store.href({ to: "home" })} className={styles.brand}>
            {store.info.name}
          </Link>
          <nav className={styles.nav} aria-label={m.mainMenu}>
            <ul className={styles.navList}>
              {items.map((item) => (
                <li key={item.label}>
                  <Link href={store.href(item.route)} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            {showSearch && (
              <Link href={store.href({ to: "catalogue" })} className={styles.iconLink} aria-label={m.search}>
                <Icon name="search" />
              </Link>
            )}
            {showFavourites && (
              <Link
                href={store.href({ to: "favourites" })}
                className={styles.iconLink}
                aria-label={m.favouritesCount(favourites.ids.length)}
              >
                <Icon name="heart" />
                <CountBadge value={favourites.ids.length} />
              </Link>
            )}
            <Link href={store.href({ to: "cart" })} className={styles.iconLink} aria-label={m.cartCount(count)}>
              <Icon name="cart" />
              <CountBadge value={count} />
            </Link>
          </div>
        </div>
        {open && (
          <nav id={drawerId} className={styles.drawer} aria-label={m.mobileMenu}>
            <ul className={styles.drawerList}>
              {items.map((item) => (
                <li key={item.label}>
                  <Link href={store.href(item.route)} className={styles.drawerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

/** The number on the cart and favourites icons. It bumps when the number changes, not on first show. */
function CountBadge({ value }: { value: number }) {
  const first = useRef(value);
  if (value <= 0) return null;
  return (
    <span key={value} className={cx(styles.count, value !== first.current && styles.bump)} aria-hidden="true">
      {value}
    </span>
  );
}
