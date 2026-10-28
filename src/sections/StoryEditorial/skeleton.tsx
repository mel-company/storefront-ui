import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, PanelBone, SectionSkeleton, Skeleton, count } from "../_shared/skeleton/Bones";

export function StoryEditorialSkeleton({ layout = "imageStart", eyebrow, body = [], image, action, tone }: { layout?: "imageStart" | "imageEnd" | "overlap" | "centered" | "quote"; eyebrow?: string; body?: string[]; image?: string; action?: unknown; tone?: SectionTone }) {
  const paragraphs = Array.from({ length: count(body.length, 1, 3) }, (_, index) => <Skeleton key={index} lines={3} />);
  if (layout === "quote" || !image) {
    return (
      <SectionSkeleton tone={tone}>
        <div className={s.centerStack}>
          {eyebrow && <Skeleton width="100px" />}
          <Skeleton shape="heading" lines={2} />
          {paragraphs}
          {action ? <Skeleton shape="pill" /> : null}
        </div>
      </SectionSkeleton>
    );
  }
  const text = (
    <div className={s.stackLg}>
      {eyebrow && <Skeleton width="100px" />}
      <Skeleton shape="heading" width="80%" />
      {paragraphs}
      {action ? <Skeleton shape="pill" /> : null}
    </div>
  );
  if (layout === "overlap" || layout === "centered") {
    return (
      <SectionSkeleton tone={tone}>
        <div className={cx(s.stackLg, layout === "overlap" && s.storyOverlap)}>
          {layout === "centered" && <div className={s.centerStack}>{text}</div>}
          <Skeleton shape="block" ratio="wide" />
          {layout === "overlap" && <PanelBone className={s.overlapCard}>{text}</PanelBone>}
        </div>
      </SectionSkeleton>
    );
  }
  const picture = <Skeleton shape="block" ratio="landscape" />;
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.split}>
        {layout === "imageStart" ? picture : text}
        {layout === "imageStart" ? text : picture}
      </div>
    </SectionSkeleton>
  );
}
