import { useRef, useState } from "react";
import { Drawer } from "../../components/Drawer";
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

/** Store name, navigation, search, favourites and the live cart count. Below 900px the links move into a side drawer. */
export function HeaderBar({ layout = "classic", links, announcement, showSearch = true, showFavourites = true }: HeaderBarProps) {
  const store = useStore();
  const Link = useLink();
  const m = useMessages();
  const categories = useCategories();
  const { count } = useCart();
  const favourites = useFavourites();
  const [open, setOpen] = useState(false);

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
          <Drawer
            title={store.info.name}
            side="start"
            open={open}
            onOpenChange={setOpen}
            trigger={
              <button type="button" className={styles.menuButton} aria-label={m.openMenu}>
                <Icon name="menu" />
              </button>
            }
          >
            {/* Close once a link is followed: the host's router may keep the header mounted. */}
            <nav aria-label={m.mobileMenu} onClickCapture={(event) => (event.target as Element).closest("a") && setOpen(false)}>
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
          </Drawer>
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
