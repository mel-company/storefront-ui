import { HeadingBones, RailBones, SectionSkeleton, type ProductsProps } from "../_shared/skeleton/Bones";

export function ProductsRailSkeleton({ eyebrow, subtitle, card, visible = 4, numbered = false, tone }: ProductsProps & { visible?: number; numbered?: boolean }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      <RailBones visible={visible} card={card} numbered={numbered} />
    </SectionSkeleton>
  );
}
