import styles from "./Countdown.module.css";
import { useNow } from "./useNow";
import { useMessages } from "../../i18n";

export interface CountdownProps {
  /** ISO date-time the offer ends. */
  endsAt: string;
  /** Fixed "now" for previews and tests. */
  now?: number;
  labels?: { days: string; hours: string; minutes: string; seconds: string };
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Renders nothing once the date has passed, so an old offer never shows zeros. */
export function Countdown({ endsAt, now: fixedNow, labels }: CountdownProps) {
  const m = useMessages();
  const ticking = useNow(1000, fixedNow);
  const now = fixedNow ?? ticking;
  const remaining = Date.parse(endsAt) - now;
  if (!Number.isFinite(remaining) || remaining <= 0) return null;
  const parts = splitDuration(remaining);
  const units = ["days", "hours", "minutes", "seconds"] as const;
  return (
    <div className={styles.countdown} role="timer" aria-label={m.endsIn(parts.days, parts.hours, parts.minutes)}>
      {units.map((unit) => (
        <span key={unit} className={styles.unit} aria-hidden="true">
          <span className={styles.value}>{String(parts[unit]).padStart(2, "0")}</span>
          <span className={styles.label}>{(labels ?? m.countdown)[unit]}</span>
        </span>
      ))}
    </div>
  );
}
