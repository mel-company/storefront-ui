import { cx } from "../../utils";
import { boneStyles as s, CardGridBones, HeadingBones, SectionSkeleton, Skeleton, type CardOptions } from "../_shared/skeleton/Bones";

export function CatalogueBrowseSkeleton({ showSearch = true, showCategories = true, showSort = true, pageSize = 12, columns = 4, card }: { showSearch?: boolean; showCategories?: boolean; showSort?: boolean; pageSize?: number; columns?: number; card?: CardOptions }) {
  return (
    <SectionSkeleton>
      <HeadingBones />
      <div className={s.toolbar}>
        {showSearch && <Skeleton shape="block" height="48px" className={s.grow} />}
        {showSort && <Skeleton shape="block" height="48px" width="180px" />}
      </div>
      {showCategories && (
        <div className={cx(s.inline, s.gapAfter)}>
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} shape="pill" width="96px" height="36px" />
          ))}
        </div>
      )}
      <CardGridBones columns={columns} count={Math.min(pageSize, columns * 2)} card={card} />
    </SectionSkeleton>
  );
}
