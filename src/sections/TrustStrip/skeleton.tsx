import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, SectionSkeleton, Skeleton, count } from "../_shared/skeleton/Bones";

export function TrustStripSkeleton({ items = [], layout = "inline", look = "plain", tone = "muted" }: { items?: unknown[]; layout?: "inline" | "stacked"; look?: "plain" | "cards" | "divided" | "ticker"; tone?: SectionTone }) {
  if (look === "ticker") {
    return (
      <SectionSkeleton tone={tone} spacing="tight">
        <div className={cx(s.inline, s.noWrap, s.tickerBones)}>
          {Array.from({ length: count(items.length, 4, 4) }, (_, index) => (
            <Skeleton key={index} width="160px" />
          ))}
        </div>
      </SectionSkeleton>
    );
  }
  return (
    <SectionSkeleton tone={tone} spacing="tight">
      <div className={s.cols}>
        {Array.from({ length: count(items.length, 3, 4) }, (_, index) => (
          <div key={index} className={layout === "stacked" ? cx(s.stack, s.centerItems) : s.feature}>
            <Skeleton shape="circle" />
            <div className={cx(s.stack, s.grow)}>
              <Skeleton width="70%" />
              <Skeleton width="90%" />
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}
