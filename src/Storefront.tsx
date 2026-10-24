import type { ReactNode } from "react";
import type { Registry } from "./core/registry";
import { RegistryProvider } from "./pages/PageRenderer";
import { builtInRegistry } from "./registry";
import { StoreProvider } from "./store/StoreProvider";
import type { StoreClient } from "./store/types";
import { ThemeProvider } from "./theme/ThemeProvider";
import type { ColorModePreference, Direction, Theme } from "./theme/schema";

export interface StorefrontProps {
  store: StoreClient;
  theme?: Theme;
  mode?: ColorModePreference;
  dir?: Direction;
  registry?: Registry;
  children: ReactNode;
}

/** All providers in one: theme, store and registry. */
export function Storefront({ store, theme, mode, dir, registry = builtInRegistry, children }: StorefrontProps) {
  return (
    <ThemeProvider theme={theme} mode={mode} dir={dir}>
      <StoreProvider store={store}>
        <RegistryProvider registry={registry}>{children}</RegistryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
