import { cx } from "../../utils";
import { boneStyles as s, SectionSkeleton, Skeleton } from "../_shared/skeleton/Bones";

export function HeaderBarSkeleton({ layout = "classic", announcement, showSearch = true, showFavourites = true }: { layout?: "classic" | "centered" | "stacked" | "minimal"; announcement?: string; showSearch?: boolean; showFavourites?: boolean }) {
  const icons = 1 + (showSearch ? 1 : 0) + (showFavourites ? 1 : 0);
  const links = (
    <div className={cx(s.inline, s.hideSmall)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} width="64px" />
      ))}
    </div>
  );
  return (
    <SectionSkeleton as="header">
      {announcement && <Skeleton width="min(320px, 80%)" className={s.announcement} />}
      <div className={cx(s.bar, layout === "centered" && s.barCentered, (layout === "stacked" || layout === "minimal") && s.barThirds)}>
        {layout === "stacked" || layout === "minimal" ? <Skeleton shape="circle" height="28px" /> : null}
        <Skeleton width={layout === "stacked" ? "150px" : "110px"} shape="heading" />
        {layout === "classic" || layout === "centered" ? links : null}
        <div className={cx(s.inline, s.alignEnd)}>
          {Array.from({ length: icons }, (_, index) => (
            <Skeleton key={index} shape="circle" height="28px" />
          ))}
        </div>
      </div>
      {layout === "stacked" && <div className={s.barNav}>{links}</div>}
    </SectionSkeleton>
  );
}
