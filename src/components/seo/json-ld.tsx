import type { Graph, Thing, WithContext } from "schema-dts";

/** Renders schema.org JSON-LD. `<` is escaped so data can never close the script tag. */
export function JsonLd({ data }: { data: Graph | WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
