import type { ComponentDefinition, PageDefinition, SectionDefinition } from "./define";

export interface Registry {
  components: Map<string, ComponentDefinition>;
  sections: Map<string, SectionDefinition>;
  pages: Map<string, PageDefinition>;
}

export function createRegistry(input: {
  components: ComponentDefinition[];
  sections: SectionDefinition[];
  pages: PageDefinition[];
}): Registry {
  const index = <T extends { id: string }>(items: T[], kind: string) => {
    const map = new Map<string, T>();
    for (const item of items) {
      if (map.has(item.id)) throw new Error(`Duplicate ${kind} id: ${item.id}`);
      map.set(item.id, item);
    }
    return map;
  };
  return {
    components: index(input.components, "component"),
    sections: index(input.sections, "section"),
    pages: index(input.pages, "page"),
  };
}
