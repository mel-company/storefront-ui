import { useId, useState } from "react";
import { Icon } from "../../icons";
import { useCart, useCategories, useFavourites, useLink, useStore } from "../../store";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import { containerClassName } from "../_shared/Section";
import styles from "./HeaderBar.module.css";

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
  const categories = useCategories();
  const { count } = useCart();
  const favourites = useFavourites();
  const [open, setOpen] = useState(false);
  const drawerId = useId();

  const items: HeaderLink[] =
    links && links.length > 0
      ? links
      : [
          { label: "Shop all", route: { to: "catalogue" } },
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
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
          <Link href={store.href({ to: "home" })} className={styles.brand}>
            {store.info.name}
          </Link>
          <nav className={styles.nav} aria-label="Main">
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
              <Link href={store.href({ to: "catalogue" })} className={styles.iconLink} aria-label="Search">
                <Icon name="search" />
              </Link>
            )}
            {showFavourites && (
              <Link
                href={store.href({ to: "favourites" })}
                className={styles.iconLink}
                aria-label={`Favourites, ${favourites.ids.length} saved`}
              >
                <Icon name="heart" />
                {favourites.ids.length > 0 && <span className={styles.count} aria-hidden="true">{favourites.ids.length}</span>}
              </Link>
            )}
            <Link href={store.href({ to: "cart" })} className={styles.iconLink} aria-label={`Cart, ${count} items`}>
              <Icon name="cart" />
              {count > 0 && <span className={styles.count} aria-hidden="true">{count}</span>}
            </Link>
          </div>
        </div>
        {open && (
          <nav id={drawerId} className={styles.drawer} aria-label="Mobile">
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
