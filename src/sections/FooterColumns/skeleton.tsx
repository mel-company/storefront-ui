import { cx } from "../../utils";
import { boneStyles as s, SectionSkeleton, Skeleton } from "../_shared/skeleton/Bones";

export function FooterColumnsSkeleton({ layout = "columns", bigName = false }: { layout?: "columns" | "centered" | "minimal"; bigName?: boolean }) {
  return (
    <SectionSkeleton as="footer">
      {layout === "columns" ? (
        <div className={s.cols}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.stack}>
              <Skeleton shape="heading" width="50%" />
              <Skeleton lines={4} width="80%" />
            </div>
          ))}
        </div>
      ) : (
        <div className={cx(s.stackLg, layout === "centered" && s.center)}>
          <Skeleton shape="heading" width="140px" />
          <div className={cx(s.inline, layout === "centered" && s.justifyCenter)}>
            {Array.from({ length: layout === "minimal" ? 4 : 6 }, (_, index) => (
              <Skeleton key={index} width="72px" />
            ))}
          </div>
        </div>
      )}
      {bigName && <Skeleton shape="block" height="96px" className={s.gapBefore} />}
      <Skeleton width="220px" className={s.gapBefore} />
    </SectionSkeleton>
  );
}
