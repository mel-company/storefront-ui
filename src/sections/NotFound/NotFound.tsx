import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Section } from "../_shared/Section";
import { useMessages } from "../../i18n";

export interface NotFoundProps {
  title?: string;
  text?: string;
}

/** The page for a broken or old link: says so plainly and offers the way back. Holds the page's h1. */
export function NotFound({ title, text }: NotFoundProps) {
  const headingId = useId();
  const m = useMessages();
  return (
    <Section labelledBy={headingId}>
      <EmptyState
        icon="search"
        headingLevel={1}
        headingId={headingId}
        title={title || m.notFoundTitle}
        text={text || m.notFoundText}
        actions={
          <>
            <ButtonLink route={{ to: "home" }} icon="home">
              {m.goHome}
            </ButtonLink>
            <ButtonLink route={{ to: "catalogue" }} variant="secondary">
              {m.shopAll}
            </ButtonLink>
          </>
        }
      />
    </Section>
  );
}
