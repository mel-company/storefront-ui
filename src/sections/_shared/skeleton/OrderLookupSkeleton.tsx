import type { SectionTone } from "../Section";
import { boneStyles as s, FieldBone, PanelBone, SectionSkeleton, Skeleton } from "./Bones";

export function OrderLookupSkeleton({ tone }: { tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.narrow}>
        <div className={s.stack}>
          <Skeleton shape="heading" width="50%" />
          <Skeleton width="80%" />
        </div>
        <PanelBone>
          <div className={s.pair}>
            <FieldBone />
            <FieldBone />
          </div>
          <Skeleton shape="pill" width="100%" height="52px" />
        </PanelBone>
      </div>
    </SectionSkeleton>
  );
}
