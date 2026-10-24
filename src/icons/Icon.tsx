import type { SVGProps } from "react";

/** 24px stroke icons, drawn for this library. `currentColor` everywhere. */
const PATHS = {
  cart: "M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H6.2M10 20.5h.01M17 20.5h.01",
  heart: "M12 20s-7.5-4.6-9.2-9.2C1.6 7.4 3.9 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.1 0 5.4 2.9 4.2 6.3C19.5 15.4 12 20 12 20Z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4",
  star: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
  truck: "M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  shield: "M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Zm-3 9 2 2 4-4",
  refresh: "M20 11a8 8 0 0 0-14.6-4.5L4 8m0-4v4h4m-4 5a8 8 0 0 0 14.6 4.5L20 16m0 4v-4h-4",
  chat: "M4 5.5h16v10H9l-5 4v-14Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  chevronEnd: "m9 6 6 6-6 6",
  chevronStart: "m15 6-6 6 6 6",
  check: "m5 12.5 4.5 4.5L19 7.5",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1Zm0 0c1.5-3 5-3 5-1s-3 1-5 1Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  bag: "M5 8h14l-1 12H6L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  instagram: "M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm8 7.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 7h.01",
  sparkle: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18",
  leaf: "M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7",
} as const;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Text for screen readers. Without it the icon is decorative. */
  label?: string;
  filled?: boolean;
}

export function Icon({ name, size = 20, label, filled = false, ...rest }: IconProps) {
  // Direction-aware icons flip in RTL so "next" always points forward.
  const flips = name === "chevronEnd" || name === "chevronStart";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={flips ? { transform: "scaleX(var(--msu-flip, 1))" } : undefined}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
