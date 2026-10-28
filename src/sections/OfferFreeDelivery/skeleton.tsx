import { cx } from "../../utils";
import type { SectionTone } from "../_shared/Section";
import { boneStyles as s, PanelBone, SectionSkeleton, Skeleton } from "../_shared/skeleton/Bones";

export function OfferFreeDeliverySkeleton({ text, action, look = "panel", tone }: { text?: string; action?: unknown; look?: "panel" | "inverted" | "minimal"; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <PanelBone className={cx(s.centerStack, look === "minimal" && s.bare)}>
        <Skeleton shape="circle" height="48px" />
        <Skeleton shape="heading" width="70%" />
        {text && <Skeleton width="90%" />}
        <Skeleton shape="block" height="10px" />
        {action ? <Skeleton shape="pill" /> : null}
      </PanelBone>
    </SectionSkeleton>
  );
}
