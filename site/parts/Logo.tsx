export function Logo() {
  return (
    <span className="logo">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--site-accent)" />
            <stop offset="1" stopColor="var(--site-accent-2)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logo-g)" />
        <path d="M9 12h14l-1.5 10h-11z" fill="var(--site-on-accent)" />
        <path d="M12.5 12v-1.5a3.5 3.5 0 0 1 7 0V12" stroke="var(--site-on-accent)" strokeWidth="2" fill="none" />
      </svg>
      Storefront UI
    </span>
  );
}
