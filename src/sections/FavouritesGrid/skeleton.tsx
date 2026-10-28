import type { SectionTone } from "../_shared/Section";
import { CardGridBones, HeadingBones, SectionSkeleton, type CardOptions } from "../_shared/skeleton/Bones";

export function FavouritesGridSkeleton({ columns = 4, card, tone }: { columns?: number; card?: CardOptions; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones />
      <CardGridBones columns={columns} card={card} />
    </SectionSkeleton>
  );
}
