import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, SectionSkeleton, Skeleton, type Heading } from "../_shared/skeleton/Bones";

export function HeroSplitSkeleton({ eyebrow, subtitle, primaryAction, secondaryAction, imageSide = "end", imageRatio = "portrait", imageStyle = "plain", moreImages = [], points = [], tone }: Heading & { primaryAction?: unknown; secondaryAction?: unknown; imageSide?: "start" | "end"; imageRatio?: "square" | "portrait" | "landscape"; imageStyle?: "plain" | "framed" | "collage"; moreImages?: unknown[]; points?: unknown[]; tone?: SectionTone }) {
  const text = (
    <div className={s.stackLg}>
      {eyebrow && <Skeleton width="100px" />}
      <Skeleton shape="heading" lines={2} />
      {subtitle && <Skeleton lines={2} />}
      {Boolean(primaryAction || secondaryAction) && (
        <div className={s.actions}>
          {primaryAction ? <Skeleton shape="pill" /> : null}
          {secondaryAction ? <Skeleton shape="pill" width="120px" /> : null}
        </div>
      )}
      {points.length > 0 && (
        <div className={s.inline}>
          {points.map((_, index) => (
            <Skeleton key={index} width="110px" />
          ))}
        </div>
      )}
    </div>
  );
  const image =
    imageStyle === "collage" && moreImages.length > 0 ? (
      <div className={s.collage}>
        <Skeleton shape="block" ratio={imageRatio} className={s.collageMain} />
        {moreImages.slice(0, 2).map((_, index) => (
          <Skeleton key={index} shape="block" ratio="square" />
        ))}
      </div>
    ) : (
      <div className={cx(imageStyle === "framed" && s.framed)}>
        <Skeleton shape="block" ratio={imageRatio} />
      </div>
    );
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.split}>
        {imageSide === "start" ? image : text}
        {imageSide === "start" ? text : image}
      </div>
    </SectionSkeleton>
  );
}
