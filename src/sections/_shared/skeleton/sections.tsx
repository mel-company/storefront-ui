import type { CSSProperties } from "react";
import { cx } from "../../../utils";
import type { SectionTone } from "../Section";
import {
  boneStyles as s,
  CardGridBones,
  FieldBone,
  HeadingBones,
  PanelBone,
  RailBones,
  RowsBones,
  SectionSkeleton,
  Skeleton,
  type CardOptions,
} from "./Bones";

/*
 * Loading versions of the built-in sections. Each one reads the same props as
 * the real section, so the placeholder has the real layout: the same columns,
 * card style, image side and tone, in LTR and RTL.
 */

interface Heading {
  eyebrow?: string;
  subtitle?: string;
}

const count = (value: number | undefined, fallback: number, max: number) => Math.min(max, Math.max(1, value ?? fallback));

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

export function HeroSplitSkeleton({ eyebrow, subtitle, primaryAction, secondaryAction, imageSide = "end", imageRatio = "portrait", imageStyle = "plain", moreImages = [], points = [], tone }: Heading & { primaryAction?: unknown; secondaryAction?: unknown; imageSide?: "start" | "end"; imageRatio?: "square" | "portrait" | "landscape"; imageStyle?: "plain" | "framed" | "collage"; moreImages?: unknown[]; points?: unknown[]; tone?: SectionTone }) {
  const text = (
    <div className={s.stackLg}>
      {eyebrow && <Skeleton width="100px" />}
      <Skeleton shape="heading" lines={2} />
      {subtitle && <Skeleton lines={2} />}
      {Boolean(primaryAction || secondaryAction) && (
        <div className={s.actions}>
          {primaryAction ? <Skeleton shape="pill" /> : null}
          {secondaryAction ? <Skeleton shape="pill" width="120px" /> : null}
        </div>
      )}
      {points.length > 0 && (
        <div className={s.inline}>
          {points.map((_, index) => (
            <Skeleton key={index} width="110px" />
          ))}
        </div>
      )}
    </div>
  );
  const image =
    imageStyle === "collage" && moreImages.length > 0 ? (
      <div className={s.collage}>
        <Skeleton shape="block" ratio={imageRatio} className={s.collageMain} />
        {moreImages.slice(0, 2).map((_, index) => (
          <Skeleton key={index} shape="block" ratio="square" />
        ))}
      </div>
    ) : (
      <div className={cx(imageStyle === "framed" && s.framed)}>
        <Skeleton shape="block" ratio={imageRatio} />
      </div>
    );
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.split}>
        {imageSide === "start" ? image : text}
        {imageSide === "start" ? text : image}
      </div>
    </SectionSkeleton>
  );
}

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

export function HeroStatementSkeleton({ eyebrow, subtitle, primaryAction, secondaryAction, align = "start", tone }: Heading & { primaryAction?: unknown; secondaryAction?: unknown; align?: "start" | "center"; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <div className={cx(s.stackLg, s.statement, align === "center" && s.center)}>
        {eyebrow && <Skeleton width="100px" />}
        <Skeleton shape="heading" lines={2} width="min(640px, 90%)" />
        {subtitle && <Skeleton lines={2} width="min(480px, 80%)" />}
        {Boolean(primaryAction || secondaryAction) && (
          <div className={s.actions}>
            {primaryAction ? <Skeleton shape="pill" /> : null}
            {secondaryAction ? <Skeleton shape="pill" /> : null}
          </div>
        )}
      </div>
    </SectionSkeleton>
  );
}

export function CategoriesTilesSkeleton({ eyebrow, subtitle, categoryIds = [], variant = "image", layout = "grid", columns = 4, tone }: Heading & { categoryIds?: string[]; variant?: "image" | "circle" | "label" | "banner" | "pill"; layout?: "grid" | "mosaic" | "scroll"; columns?: number; tone?: SectionTone }) {
  const tiles = count(categoryIds.length || undefined, layout === "mosaic" ? 5 : columns, 12);
  const tile = (index: number) => {
    if (variant === "label") return <Skeleton key={index} shape="block" height="56px" />;
    if (variant === "pill") return <Skeleton key={index} shape="pill" width="120px" />;
    if (variant === "banner") return <Skeleton key={index} shape="block" ratio="wide" />;
    return (
      <div key={index} className={cx(s.stack, variant === "circle" && s.centerItems)}>
        {variant === "circle" ? <Skeleton shape="circle" height="96px" /> : <Skeleton shape="block" ratio="square" />}
        <Skeleton width="60%" />
      </div>
    );
  };
  const className =
    variant === "pill" ? cx(s.inline, layout === "scroll" && s.noWrap) : layout === "scroll" ? s.rail : layout === "mosaic" && variant === "image" ? s.mosaic : s.tiles;
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      <div className={className} style={{ "--msu-columns": columns, "--msu-visible": columns } as CSSProperties}>
        {layout === "mosaic" && variant === "image"
          ? Array.from({ length: tiles }, (_, index) => <Skeleton key={index} shape="block" className={s.mosaicTile} />)
          : Array.from({ length: tiles }, (_, index) => tile(index))}
      </div>
    </SectionSkeleton>
  );
}

interface ProductsProps extends Heading {
  source?: { limit?: number; ids?: string[] };
  card?: CardOptions;
  action?: unknown;
  tone?: SectionTone;
}

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

export function ProductsRailSkeleton({ eyebrow, subtitle, card, visible = 4, numbered = false, tone }: ProductsProps & { visible?: number; numbered?: boolean }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      <RailBones visible={visible} card={card} numbered={numbered} />
    </SectionSkeleton>
  );
}

export function TrustStripSkeleton({ items = [], layout = "inline", look = "plain", tone = "muted" }: { items?: unknown[]; layout?: "inline" | "stacked"; look?: "plain" | "cards" | "divided" | "ticker"; tone?: SectionTone }) {
  if (look === "ticker") {
    return (
      <SectionSkeleton tone={tone} spacing="tight">
        <div className={cx(s.inline, s.noWrap, s.tickerBones)}>
          {Array.from({ length: count(items.length, 4, 4) }, (_, index) => (
            <Skeleton key={index} width="160px" />
          ))}
        </div>
      </SectionSkeleton>
    );
  }
  return (
    <SectionSkeleton tone={tone} spacing="tight">
      <div className={s.cols}>
        {Array.from({ length: count(items.length, 3, 4) }, (_, index) => (
          <div key={index} className={layout === "stacked" ? cx(s.stack, s.centerItems) : s.feature}>
            <Skeleton shape="circle" />
            <div className={cx(s.stack, s.grow)}>
              <Skeleton width="70%" />
              <Skeleton width="90%" />
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

export function OfferFreeDeliverySkeleton({ text, action, look = "panel", tone }: { text?: string; action?: unknown; look?: "panel" | "inverted" | "minimal"; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <PanelBone className={cx(s.centerStack, look === "minimal" && s.bare)}>
        <Skeleton shape="circle" height="48px" />
        <Skeleton shape="heading" width="70%" />
        {text && <Skeleton width="90%" />}
        <Skeleton shape="block" height="10px" />
        {action ? <Skeleton shape="pill" /> : null}
      </PanelBone>
    </SectionSkeleton>
  );
}

export function BundleBuilderSkeleton({ eyebrow, subtitle, pickCount = 3, tone }: Heading & { pickCount?: number; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} />
      <div className={cx(s.split, s.splitTop, s.wideStart)}>
        <CardGridBones columns={3} count={6} card={{ variant: "boxed", imageRatio: "square" }} />
        <PanelBone>
          <Skeleton shape="heading" width="60%" />
          {Array.from({ length: pickCount }, (_, index) => (
            <Skeleton key={index} shape="block" height="56px" />
          ))}
          <RowsBones rows={2} />
          <Skeleton shape="pill" width="100%" />
        </PanelBone>
      </div>
    </SectionSkeleton>
  );
}

export function StoryEditorialSkeleton({ layout = "imageStart", eyebrow, body = [], image, action, tone }: { layout?: "imageStart" | "imageEnd" | "overlap" | "centered" | "quote"; eyebrow?: string; body?: string[]; image?: string; action?: unknown; tone?: SectionTone }) {
  const paragraphs = Array.from({ length: count(body.length, 1, 3) }, (_, index) => <Skeleton key={index} lines={3} />);
  if (layout === "quote" || !image) {
    return (
      <SectionSkeleton tone={tone}>
        <div className={s.centerStack}>
          {eyebrow && <Skeleton width="100px" />}
          <Skeleton shape="heading" lines={2} />
          {paragraphs}
          {action ? <Skeleton shape="pill" /> : null}
        </div>
      </SectionSkeleton>
    );
  }
  const text = (
    <div className={s.stackLg}>
      {eyebrow && <Skeleton width="100px" />}
      <Skeleton shape="heading" width="80%" />
      {paragraphs}
      {action ? <Skeleton shape="pill" /> : null}
    </div>
  );
  if (layout === "overlap" || layout === "centered") {
    return (
      <SectionSkeleton tone={tone}>
        <div className={cx(s.stackLg, layout === "overlap" && s.storyOverlap)}>
          {layout === "centered" && <div className={s.centerStack}>{text}</div>}
          <Skeleton shape="block" ratio="wide" />
          {layout === "overlap" && <PanelBone className={s.overlapCard}>{text}</PanelBone>}
        </div>
      </SectionSkeleton>
    );
  }
  const picture = <Skeleton shape="block" ratio="landscape" />;
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.split}>
        {layout === "imageStart" ? picture : text}
        {layout === "imageStart" ? text : picture}
      </div>
    </SectionSkeleton>
  );
}

export function FaqListSkeleton({ eyebrow, subtitle, items = [], layout = "split", tone }: Heading & { items?: unknown[]; layout?: "split" | "stacked" | "columns"; tone?: SectionTone }) {
  const rows = (n: number) => (
    <div className={s.stack}>
      {Array.from({ length: n }, (_, index) => (
        <Skeleton key={index} shape="block" height="56px" />
      ))}
    </div>
  );
  const total = count(items.length, 3, 8);
  return (
    <SectionSkeleton tone={tone}>
      <div className={layout === "columns" ? undefined : s.narrow}>
        <HeadingBones eyebrow={Boolean(eyebrow)} subtitle={Boolean(subtitle)} align={layout === "split" ? "start" : "center"} />
        {layout === "columns" ? (
          <div className={s.cols}>
            {rows(Math.ceil(total / 2))}
            {rows(Math.floor(total / 2))}
          </div>
        ) : (
          rows(total)
        )}
      </div>
    </SectionSkeleton>
  );
}

export function ProductDetailSkeleton({ details = [], gallery = "thumbsBelow", imageRatio = "square", gallerySide = "start" }: { details?: unknown[]; gallery?: "thumbsBelow" | "thumbsSide" | "grid" | "stack"; imageRatio?: "square" | "portrait"; gallerySide?: "start" | "end" }) {
  return (
    <SectionSkeleton>
      <div className={cx(s.split, s.splitTop, gallerySide === "end" && s.splitReverse)}>
        {gallery === "grid" || gallery === "stack" ? (
          <div className={cx(s.galleryAll, gallery === "grid" && s.galleryGrid)}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} shape="block" ratio={imageRatio} />
            ))}
          </div>
        ) : (
          <div className={cx(s.stack, gallery === "thumbsSide" && s.gallerySide)}>
            <Skeleton shape="block" ratio={imageRatio} />
            <div className={s.thumbs}>
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} shape="block" ratio={imageRatio} />
              ))}
            </div>
          </div>
        )}
        <div className={s.stackLg}>
          <Skeleton width="120px" />
          <Skeleton shape="heading" lines={2} />
          <Skeleton shape="heading" width="30%" />
          <Skeleton lines={3} />
          <div className={s.inline}>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} shape="pill" width="72px" height="40px" />
            ))}
          </div>
          <div className={s.buy}>
            <Skeleton shape="pill" width="128px" height="52px" />
            <Skeleton shape="pill" width="100%" height="52px" />
          </div>
          {Array.from({ length: Math.min(details.length, 4) }, (_, index) => (
            <Skeleton key={index} shape="block" height="48px" />
          ))}
        </div>
      </div>
    </SectionSkeleton>
  );
}

export function ProductsRelatedSkeleton({ limit = 8, card }: { limit?: number; card?: CardOptions }) {
  return (
    <SectionSkeleton>
      <HeadingBones />
      <RailBones visible={Math.min(4, limit)} card={card} />
    </SectionSkeleton>
  );
}

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

function SummaryPanel({ rows = 3 }: { rows?: number }) {
  return (
    <PanelBone>
      <Skeleton shape="heading" width="50%" />
      <RowsBones rows={rows} />
      <Skeleton shape="pill" width="100%" height="52px" />
    </PanelBone>
  );
}

function LineBones({ lines = 3 }: { lines?: number }) {
  return (
    <div className={s.stackLg}>
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className={s.line}>
          <Skeleton shape="block" ratio="square" className={s.thumb} />
          <div className={s.stack}>
            <Skeleton width="70%" />
            <Skeleton width="40%" />
            <Skeleton shape="pill" width="112px" height="36px" />
          </div>
          <Skeleton width="64px" />
        </div>
      ))}
    </div>
  );
}

export function CartSummarySkeleton({ showFreeDelivery = true }: { showFreeDelivery?: boolean }) {
  return (
    <SectionSkeleton>
      <HeadingBones />
      <div className={cx(s.split, s.splitTop, s.wideStart)}>
        <div className={s.stackLg}>
          {showFreeDelivery && <Skeleton shape="block" height="56px" />}
          <LineBones />
        </div>
        <SummaryPanel />
      </div>
    </SectionSkeleton>
  );
}

export function CheckoutFormSkeleton({ showBreadcrumbs = true, showNotes = true, paymentLayout = "list", summaryFirst = false, tone }: { showBreadcrumbs?: boolean; showNotes?: boolean; paymentLayout?: "list" | "grid"; summaryFirst?: boolean; tone?: SectionTone }) {
  const form = (
    <div className={s.stackLg}>
      <PanelBone>
        <Skeleton shape="heading" width="40%" />
        <div className={s.pair}>
          <FieldBone />
          <FieldBone />
        </div>
      </PanelBone>
      <PanelBone>
        <Skeleton shape="heading" width="40%" />
        <FieldBone />
        <FieldBone />
        {showNotes && <FieldBone tall />}
      </PanelBone>
      <PanelBone>
        <Skeleton shape="heading" width="40%" />
        <div className={paymentLayout === "grid" ? s.pair : s.stack}>
          <Skeleton shape="block" height="64px" />
          <Skeleton shape="block" height="64px" />
        </div>
      </PanelBone>
    </div>
  );
  return (
    <SectionSkeleton tone={tone}>
      {showBreadcrumbs && <Skeleton width="160px" className={s.gapAfter} />}
      <HeadingBones />
      <div className={cx(s.split, s.splitTop, s.wideStart, summaryFirst && s.summaryFirst)}>
        {form}
        <SummaryPanel rows={4} />
      </div>
    </SectionSkeleton>
  );
}

function MessageBones({ actions, tone }: { actions: number; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.centerStack}>
        <Skeleton shape="circle" height="64px" />
        <Skeleton shape="heading" width="80%" />
        <Skeleton lines={2} />
        <div className={cx(s.actions, s.centerActions)}>
          {Array.from({ length: actions }, (_, index) => (
            <Skeleton key={index} shape="pill" />
          ))}
        </div>
      </div>
    </SectionSkeleton>
  );
}

export function OrderConfirmationSkeleton({ showTracking = true, showInvoice = true, tone }: { showTracking?: boolean; showInvoice?: boolean; tone?: SectionTone }) {
  return <MessageBones actions={1 + (showTracking ? 1 : 0) + (showInvoice ? 1 : 0)} tone={tone} />;
}

export function NotFoundSkeleton({ showShopAll = true, tone }: { showShopAll?: boolean; tone?: SectionTone }) {
  return <MessageBones actions={showShopAll ? 2 : 1} tone={tone} />;
}

/** Order tracking and invoices: a title, a line, and the number and phone form. */
export function OrderLookupSkeleton({ tone }: { tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <div className={s.narrow}>
        <div className={s.stack}>
          <Skeleton shape="heading" width="50%" />
          <Skeleton width="80%" />
        </div>
        <PanelBone>
          <div className={s.pair}>
            <FieldBone />
            <FieldBone />
          </div>
          <Skeleton shape="pill" width="100%" height="52px" />
        </PanelBone>
      </div>
    </SectionSkeleton>
  );
}

export function FavouritesGridSkeleton({ columns = 4, card, tone }: { columns?: number; card?: CardOptions; tone?: SectionTone }) {
  return (
    <SectionSkeleton tone={tone}>
      <HeadingBones />
      <CardGridBones columns={columns} card={card} />
    </SectionSkeleton>
  );
}

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
