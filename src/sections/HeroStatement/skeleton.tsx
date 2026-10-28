import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, SectionSkeleton, Skeleton, type Heading } from "../_shared/skeleton/Bones";

export function HeroStatementSkeleton({ eyebrow, subtitle, primaryAction, secondaryAction, align = "start", tone }: Heading & { primaryAction?: unknown; secondaryAction?: unknown; align?: "start" | "center"; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <div className={cx(s.stackLg, s.statement, align === "center" && s.center)}>
        {eyebrow && <Skeleton width="100px" />}
        <Skeleton shape="heading" lines={2} width="min(640px, 90%)" />
        {subtitle && <Skeleton lines={2} width="min(480px, 80%)" />}
        {Boolean(primaryAction || secondaryAction) && (
          <div className={s.actions}>
            {primaryAction ? <Skeleton shape="pill" /> : null}
            {secondaryAction ? <Skeleton shape="pill" /> : null}
          </div>
        )}
      </div>
    </SectionSkeleton>
  );
}
