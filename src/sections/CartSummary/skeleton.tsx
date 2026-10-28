import { cx } from "../../utils";
import { boneStyles as s, HeadingBones, SectionSkeleton, Skeleton, SummaryPanel, LineBones } from "../_shared/skeleton/Bones";

export function CartSummarySkeleton({ showFreeDelivery = true }: { showFreeDelivery?: boolean }) {
  return (
    <SectionSkeleton>
      <HeadingBones />
      <div className={cx(s.split, s.splitTop, s.wideStart)}>
        <div className={s.stackLg}>
          {showFreeDelivery && <Skeleton shape="block" height="56px" />}
          <LineBones />
        </div>
        <SummaryPanel />
      </div>
    </SectionSkeleton>
  );
}
