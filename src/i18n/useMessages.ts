import { useMemo } from "react";
import { useOptionalStore } from "../store/StoreProvider";
import { languageOf, messages, type Messages } from "./messages";

/** Built-in text in the store's language, with the store's own overrides on top. English outside a store. */
export function useMessages(): Messages {
  const info = useOptionalStore()?.info;
  const locale = info?.locale;
  const overrides = info?.messages;
  return useMemo(() => {
    const base = messages[languageOf(locale)];
    return overrides ? { ...base, ...overrides } : base;
  }, [locale, overrides]);
}
