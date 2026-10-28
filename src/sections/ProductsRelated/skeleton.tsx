import { HeadingBones, RailBones, SectionSkeleton, type CardOptions } from "../_shared/skeleton/Bones";

export function ProductsRelatedSkeleton({ limit = 8, card }: { limit?: number; card?: CardOptions }) {
  return (
    <SectionSkeleton>
      <HeadingBones />
      <RailBones visible={Math.min(4, limit)} card={card} />
    </SectionSkeleton>
  );
}
