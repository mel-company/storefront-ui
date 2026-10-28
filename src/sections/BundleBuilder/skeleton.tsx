import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, CardGridBones, HeadingBones, PanelBone, RowsBones, SectionSkeleton, Skeleton, type Heading } from "../_shared/skeleton/Bones";

export function BundleBuilderSkeleton({ eyebrow, subtitle, pickCount = 3, tone }: Heading & { pickCount?: number; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      <div className={cx(s.split, s.splitTop, s.wideStart)}>
        <CardGridBones columns={3} count={6} card={{ variant: "boxed", imageRatio: "square" }} />
        <PanelBone>
          <Skeleton shape="heading" width="60%" />
          {Array.from({ length: pickCount }, (_, index) => (
            <Skeleton key={index} shape="block" height="56px" />
          ))}
          <RowsBones rows={2} />
          <Skeleton shape="pill" width="100%" />
        </PanelBone>
      </div>
    </SectionSkeleton>
  );
}
