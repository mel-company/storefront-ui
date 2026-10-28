import { cx } from "../../utils";
import { boneStyles as s, SectionSkeleton, Skeleton } from "../_shared/skeleton/Bones";

export function ProductDetailSkeleton({ details = [], gallery = "thumbsBelow", imageRatio = "square", gallerySide = "start" }: { details?: unknown[]; gallery?: "thumbsBelow" | "thumbsSide" | "grid" | "stack"; imageRatio?: "square" | "portrait"; gallerySide?: "start" | "end" }) {
  return (
    <SectionSkeleton>
      <div className={cx(s.split, s.splitTop, gallerySide === "end" && s.splitReverse)}>
        {gallery === "grid" || gallery === "stack" ? (
          <div className={cx(s.galleryAll, gallery === "grid" && s.galleryGrid)}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} shape="block" ratio={imageRatio} />
            ))}
          </div>
        ) : (
          <div className={cx(s.stack, gallery === "thumbsSide" && s.gallerySide)}>
            <Skeleton shape="block" ratio={imageRatio} />
            <div className={s.thumbs}>
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} shape="block" ratio={imageRatio} />
              ))}
            </div>
          </div>
        )}
        <div className={s.stackLg}>
          <Skeleton width="120px" />
          <Skeleton shape="heading" lines={2} />
          <Skeleton shape="heading" width="30%" />
          <Skeleton lines={3} />
          <div className={s.inline}>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} shape="pill" width="72px" height="40px" />
            ))}
          </div>
          <div className={s.buy}>
            <Skeleton shape="pill" width="128px" height="52px" />
            <Skeleton shape="pill" width="100%" height="52px" />
          </div>
          {Array.from({ length: Math.min(details.length, 4) }, (_, index) => (
            <Skeleton key={index} shape="block" height="48px" />
          ))}
        </div>
      </div>
    </SectionSkeleton>
  );
}
