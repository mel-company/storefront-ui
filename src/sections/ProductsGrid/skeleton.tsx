import { CardGridBones, HeadingBones, SectionSkeleton, count, type ProductsProps } from "../_shared/skeleton/Bones";

export function ProductsGridSkeleton({ eyebrow, subtitle, source, card, columns = 4, layout = "grid", tone }: ProductsProps & { columns?: number; layout?: "grid" | "featured" }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      {layout === "featured" ? (
        <CardGridBones columns={4} count={5} card={card} featured />
      ) : (
        <CardGridBones columns={columns} count={count(source?.ids?.length || source?.limit, columns, columns * 2)} card={card} />
      )}
    </SectionSkeleton>
  );
}
