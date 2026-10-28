import type { CSSProperties } from "react";
import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, HeadingBones, SectionSkeleton, Skeleton, type Heading, count } from "../_shared/skeleton/Bones";

export function CategoriesTilesSkeleton({ eyebrow, subtitle, categoryIds = [], variant = "image", layout = "grid", columns = 4, tone }: Heading & { categoryIds?: string[]; variant?: "image" | "circle" | "label" | "banner" | "pill"; layout?: "grid" | "mosaic" | "scroll"; columns?: number; tone?: SectionTone }) {
  const tiles = count(categoryIds.length || undefined, layout === "mosaic" ? 5 : columns, 12);
  const tile = (index: number) => {
    if (variant === "label") return <Skeleton key={index} shape="block" height="56px" />;
    if (variant === "pill") return <Skeleton key={index} shape="pill" width="120px" />;
    if (variant === "banner") return <Skeleton key={index} shape="block" ratio="wide" />;
    return (
      <div key={index} className={cx(s.stack, variant === "circle" && s.centerItems)}>
        {variant === "circle" ? <Skeleton shape="circle" height="96px" /> : <Skeleton shape="block" ratio="square" />}
        <Skeleton width="60%" />
      </div>
    );
  };
  const className =
    variant === "pill" ? cx(s.inline, layout === "scroll" && s.noWrap) : layout === "scroll" ? s.rail : layout === "mosaic" && variant === "image" ? s.mosaic : s.tiles;
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      <div className={className} style={{ "--msu-columns": columns, "--msu-visible": columns } as CSSProperties}>
        {layout === "mosaic" && variant === "image"
          ? Array.from({ length: tiles }, (_, index) => <Skeleton key={index} shape="block" className={s.mosaicTile} />)
          : Array.from({ length: tiles }, (_, index) => tile(index))}
      </div>
    </SectionSkeleton>
  );
}
