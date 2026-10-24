import { componentDefinitions } from "./components";
import { createRegistry } from "./core/registry";
import { pageDefinitions } from "./pages/definitions";
import { sectionDefinitions } from "./sections";

/** Every built-in component, section and page. */
export const builtInRegistry = createRegistry({
  components: componentDefinitions,
  sections: sectionDefinitions,
  pages: pageDefinitions,
});
