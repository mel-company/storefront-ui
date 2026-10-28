import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, FieldBone, HeadingBones, PanelBone, SectionSkeleton, Skeleton, SummaryPanel } from "../_shared/skeleton/Bones";

export function CheckoutFormSkeleton({ showBreadcrumbs = true, showNotes = true, paymentLayout = "list", summaryFirst = false, tone }: { showBreadcrumbs?: boolean; showNotes?: boolean; paymentLayout?: "list" | "grid"; summaryFirst?: boolean; tone?: SectionTone }) {
  const form = (
    <div className={s.stackLg}>
      <PanelBone>
        <Skeleton shape="heading" width="40%" />
        <div className={s.pair}>
          <FieldBone />
          <FieldBone />
        </div>
      </PanelBone>
      <PanelBone>
        <Skeleton shape="heading" width="40%" />
        <FieldBone />
        <FieldBone />
        {showNotes && <FieldBone tall />}
      </PanelBone>
      <PanelBone>
        <Skeleton shape="heading" width="40%" />
        <div className={paymentLayout === "grid" ? s.pair : s.stack}>
          <Skeleton shape="block" height="64px" />
          <Skeleton shape="block" height="64px" />
        </div>
      </PanelBone>
    </div>
  );
  return (
    <SectionSkeleton tone={tone}>
      {showBreadcrumbs && <Skeleton width="160px" className={s.gapAfter} />}
      <HeadingBones />
      <div className={cx(s.split, s.splitTop, s.wideStart, summaryFirst && s.summaryFirst)}>
        {form}
        <SummaryPanel rows={4} />
      </div>
    </SectionSkeleton>
  );
}
