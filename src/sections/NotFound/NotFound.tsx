import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import type { IconName } from "../../icons";
import { Section, type SectionTone } from "../_shared/Section";
import { useMessages } from "../../i18n";

export interface NotFoundProps {
  icon?: IconName;
  title?: string;
  text?: string;
  /** A second button to every product. */
  showShopAll?: boolean;
  tone?: SectionTone;
}

/** The page for a broken or old link: says so plainly and offers the way back. Holds the page's h1. */
export function NotFound({ icon = "search", title, text, showShopAll = true, tone }: NotFoundProps) {
  const headingId = useId();
  const m = useMessages();
  return (
    <Section labelledBy={headingId} tone={tone}>
      <EmptyState
        icon={icon}
        headingLevel={1}
        headingId={headingId}
        title={title || m.notFoundTitle}
        text={text || m.notFoundText}
        actions={
          <>
            <ButtonLink route={{ to: "home" }} icon="home">
              {m.goHome}
            </ButtonLink>
            {showShopAll && (
              <ButtonLink route={{ to: "catalogue" }} variant="secondary">
                {m.shopAll}
              </ButtonLink>
            )}
          </>
        }
      />
    </Section>
  );
}
