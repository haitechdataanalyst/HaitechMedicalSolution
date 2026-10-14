/**
 * Renders one JSON-LD block. Data always comes from our own builders in
 * lib/structured-data.ts; "<" is escaped so no string can close the script tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | null }) {
    if (!data) return null;
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
