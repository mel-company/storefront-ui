import type { SectionTone } from "../_shared/Section";
import { MessageBones } from "../_shared/skeleton/Bones";

export function NotFoundSkeleton({ showShopAll = true, tone }: { showShopAll?: boolean; tone?: SectionTone }) {
  return <MessageBones actions={showShopAll ? 2 : 1} tone={tone} />;
}

/** Order tracking and invoices: a title, a line, and the number and phone form. */
