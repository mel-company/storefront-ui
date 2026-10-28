import type { ReactNode } from "react";
import type { Registry } from "./core/registry";
import { directionOf } from "./i18n/messages";
import { RegistryProvider } from "./pages/PageRenderer";
import { StoreProvider } from "./store/StoreProvider";
import type { StoreClient } from "./store/types";
import { ThemeProvider } from "./theme/ThemeProvider";
import type { ColorModePreference, Direction, Theme } from "./theme/schema";

export interface StorefrontProps {
  store: StoreClient;
  theme?: Theme;
  mode?: ColorModePreference;
  /** Defaults to the store's locale: `rtl` for Arabic (and other right-to-left languages). */
  dir?: Direction;
  /** The sections pages can use: `registry` from your copied folder, or `builtInRegistry` inside this repo. */
  registry: Registry;
  children: ReactNode;
}

/** All providers in one: theme, store and registry. */
export function Storefront({ store, theme, mode, dir, registry, children }: StorefrontProps) {
  return (
    <ThemeProvider theme={theme} mode={mode} dir={dir ?? directionOf(store.info.locale)}>
      <StoreProvider store={store}>
        <RegistryProvider registry={registry}>{children}</RegistryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
