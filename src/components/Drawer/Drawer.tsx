import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useState, type ReactElement, type ReactNode } from "react";
import { useMessages } from "../../i18n";
import { Icon } from "../../icons";
import { trapFramedTab } from "../../theme/framed";
import { usePortalContainer } from "../../theme/ThemeProvider";
import { cx } from "../../utils";
import styles from "./Drawer.module.css";

export interface DrawerProps {
  title: string;
  /** Shown under the title and read out when the drawer opens. */
  description?: string;
  /** Keeps the title for screen readers only. */
  hideTitle?: boolean;
  /** `start` is the left edge in English and the right edge in Arabic. */
  side?: "start" | "end";
  /** The button that opens it. Leave out when you control `open` yourself. */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Pinned to the bottom, e.g. a checkout button. */
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * A panel that slides in from the side. Built on Radix Dialog: focus stays
 * inside while it is open, Escape and the backdrop close it, the page behind
 * stops scrolling, and focus goes back to the button that opened it.
 */
export function Drawer({
  title,
  description,
  hideTitle = false,
  side = "start",
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  footer,
  className,
  children,
}: DrawerProps) {
  const m = useMessages();
  const container = usePortalContainer();
  const [own, setOwn] = useState(defaultOpen ?? false);
  const shown = open ?? own;
  const change = useCallback(
    (next: boolean) => {
      if (open === undefined) setOwn(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );
  return (
    <Dialog.Root open={shown} onOpenChange={change}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal container={container}>
        {/* Radix closes on this press itself, except in a store portaled into an editor's iframe (see theme/framed). */}
        <Dialog.Overlay className={styles.overlay} onClick={() => shown && change(false)} />
        <Dialog.Content className={cx(styles.panel, styles[side], className)}
          {...(description ? {} : { "aria-describedby": undefined })}
          onKeyDown={(event) => trapFramedTab(event, event.currentTarget)}
        >
          <div className={styles.head}>
            <Dialog.Title className={cx(styles.title, hideTitle && "msu-visually-hidden")}>{title}</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label={m.close}>
              <Icon name="close" />
            </Dialog.Close>
          </div>
          {description && <Dialog.Description className={styles.description}>{description}</Dialog.Description>}
          <div className={styles.body}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
