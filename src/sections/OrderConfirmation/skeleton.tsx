import type { SectionTone } from "../_shared/Section";
import { MessageBones } from "../_shared/skeleton/Bones";

export function OrderConfirmationSkeleton({ showTracking = true, showInvoice = true, tone }: { showTracking?: boolean; showInvoice?: boolean; tone?: SectionTone }) {
  return <MessageBones actions={1 + (showTracking ? 1 : 0) + (showInvoice ? 1 : 0)} tone={tone} />;
}
