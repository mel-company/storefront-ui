import { cx } from "../../utils";
import { boneStyles as s, SectionSkeleton, Skeleton } from "../_shared/skeleton/Bones";

export function HeroBannerSkeleton({ subtitle, action, align = "start", height = "tall", phoneLayout = "over" }: { subtitle?: string; action?: unknown; align?: "start" | "center" | "end"; height?: "compact" | "tall" | "full"; phoneLayout?: "over" | "below" }) {
  return (
    <SectionSkeleton spacing="tight">
      <div className={cx(s.overlay, phoneLayout === "below" && s.overlayBelow)}>
        <Skeleton shape="block" className={cx(s.banner, height === "compact" && s.bannerCompact, height === "full" && s.bannerFull)} />
        <div className={cx(s.overlayPanel, align === "center" && s.overlayCenter, align === "end" && s.overlayEnd)}>
          <Skeleton shape="heading" lines={2} />
          {subtitle && <Skeleton lines={2} />}
          {action ? <Skeleton shape="pill" /> : null}
        </div>
      </div>
    </SectionSkeleton>
  );
}
