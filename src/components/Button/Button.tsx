import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon, type IconName } from "../../icons";
import { useLink, useStore } from "../../store";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface Look {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: IconName;
  iconEnd?: IconName;
}

export const buttonClassName = ({ variant = "primary", size = "md", fullWidth }: Look, iconOnly = false) =>
  cx(styles.button, styles[variant], size !== "md" && styles[size], fullWidth && styles.full, iconOnly && styles.iconOnly);

export interface ButtonProps extends Look, ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

/** An action on this page. For navigation use `ButtonLink`. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, icon, iconEnd, className, children, type = "button", ...rest },
  ref,
) {
  const iconOnly = !children && Boolean(icon);
  if (iconOnly && !rest["aria-label"]) {
    throw new Error("An icon-only Button needs an aria-label");
  }
  return (
    <button
      ref={ref}
      type={type}
      className={cx(buttonClassName({ variant, size, fullWidth }, iconOnly), className)}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 20} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === "sm" ? 16 : 20} />}
    </button>
  );
});

export interface ButtonLinkProps extends Look {
  route: Route;
  children: ReactNode;
  className?: string;
}

/** A link styled as a button. Always goes through the platform's router. */
export function ButtonLink({ route, children, className, icon, iconEnd, ...look }: ButtonLinkProps) {
  const store = useStore();
  const Link = useLink();
  return (
    <Link href={store.href(route)} className={cx(buttonClassName(look), className)}>
      {icon && <Icon name={icon} size={look.size === "sm" ? 16 : 20} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={look.size === "sm" ? 16 : 20} />}
    </Link>
  );
}
