import { Icon } from "../../icons";
import { useLink, useStore } from "../../store";
import type { Route } from "../../store/types";
import styles from "./Breadcrumbs.module.css";
import { useMessages } from "../../i18n";

export interface BreadcrumbItem {
  label: string;
  /** Leave out on the last item, the page you are on. */
  route?: Route;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Start with the store's home page. */
  showHome?: boolean;
  separator?: "chevron" | "slash";
}

/** Where this page sits, as links back up. The last item is the current page. */
export function Breadcrumbs({ items, showHome = true, separator = "chevron" }: BreadcrumbsProps) {
  const store = useStore();
  const Link = useLink();
  const m = useMessages();
  const trail: BreadcrumbItem[] = showHome ? [{ label: m.home, route: { to: "home" } }, ...items] : items;
  return (
    <nav aria-label={m.breadcrumbs}>
      <ol className={styles.list}>
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {last || !item.route ? (
                <span className={styles.current} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={store.href(item.route)} className={styles.link}>
                  {item.label}
                </Link>
              )}
              {!last &&
                (separator === "slash" ? (
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                ) : (
                  <Icon name="chevronEnd" size={14} className={styles.separator} />
                ))}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
