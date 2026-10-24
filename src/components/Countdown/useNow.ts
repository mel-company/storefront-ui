import { useEffect, useState } from "react";

/** The current time, ticking every `interval` ms. `initial` keeps server renders stable. */
export function useNow(interval = 1000, initial?: number): number {
  const [now, setNow] = useState(() => initial ?? Date.now());
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(timer);
  }, [interval]);
  return now;
}
