import { useId } from "react";
import { ButtonLink } from "../../components/Button/Button";
import { Media } from "../../components/Media/Media";
import type { Route } from "../../store/types";
import { cx } from "../../utils";
import { Section, type SectionTone } from "../_shared/Section";
import styles from "./StoryEditorial.module.css";

export interface StoryEditorialProps {
  /** imageStart / imageEnd: side by side. overlap: the text card sits over the edge of a wide image. centered: text in the middle, wide image under it. quote: one large quote. */
  layout?: "imageStart" | "imageEnd" | "overlap" | "centered" | "quote";
  eyebrow?: string;
  title: string;
  /** Paragraphs. */
  body: string[];
  image?: string;
  imageAlt?: string;
  action?: { label: string; route: Route };
  tone?: SectionTone;
}

/** The brand's story: image and text side by side, or one large quote. */
export function StoryEditorial({ layout = "imageStart", eyebrow, title, body, image, imageAlt = "", action, tone }: StoryEditorialProps) {
  const headingId = useId();
  if (layout === "quote") {
    return (
      <Section labelledBy={headingId} tone={tone}>
        <h2 id={headingId} className="msu-visually-hidden">
          {title}
        </h2>
        <blockquote className={styles.quote}>
          <p>{body[0] ?? title}</p>
        </blockquote>
      </Section>
    );
  }
  const wide = layout === "overlap" || layout === "centered";
  return (
    <Section labelledBy={headingId} tone={tone}>
      <div className={cx(styles.story, layout !== "imageStart" && styles[layout], !image && styles.noImage)}>
        {image && (
          <div className={styles.media}>
            <Media src={image} alt={imageAlt} ratio={wide ? "wide" : "landscape"} />
          </div>
        )}
        <div className={styles.copy}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          <div className={styles.body}>
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {action && (
            <ButtonLink route={action.route} variant="secondary">
              {action.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </Section>
  );
}
