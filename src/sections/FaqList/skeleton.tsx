import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, HeadingBones, SectionSkeleton, Skeleton, type Heading, count } from "../_shared/skeleton/Bones";

export function FaqListSkeleton({ eyebrow, subtitle, items = [], layout = "split", tone }: Heading & { items?: unknown[]; layout?: "split" | "stacked" | "columns"; tone?: SectionTone }) {
  const rows = (n: number) => (
    <div className={s.stack}>
      {Array.from({ length: n }, (_, index) => (
        <Skeleton key={index} shape="block" height="56px" />
      ))}
    </div>
  );
  const total = count(items.length, 3, 8);
  return (
    <SectionSkeleton tone={tone}>
      <div className={layout === "columns" ? undefined : s.narrow}>
        <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} align={layout === "split" ? "start" : "center"} />
        {layout === "columns" ? (
          <div className={s.cols}>
            {rows(Math.ceil(total / 2))}
            {rows(Math.floor(total / 2))}
          </div>
        ) : (
          rows(total)
        )}
      </div>
    </SectionSkeleton>
  );
}
