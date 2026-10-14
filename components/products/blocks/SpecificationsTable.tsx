import { SpecificationsBlock as SpecificationsBlockType } from "@/types";
import { ExpandableTable } from "@/components/ui/Expandable";

interface SpecificationsTableProps {
    data: SpecificationsBlockType["data"];
    /** Opt-in progressive disclosure: rows shown while collapsed. Rows are displayed in data order. */
    visibleRows?: number;
}

export default function SpecificationsTable({ data, visibleRows }: SpecificationsTableProps) {
    // Handle both 'rows' and 'specs' field names for backwards compatibility
    const rows = data.rows ?? data.specs ?? [];

    if (rows.length === 0) {
        return null;
    }

    const rowElements = rows.map((row: { label: string; value: string }, index: number) => (
        <tr key={index} className="border-b border-neutral-900/[0.06] last:border-b-0">
            <th scope="row" className="w-2/5 py-3.5 pr-4 text-left align-top text-[15px] font-normal text-neutral-500 sm:w-1/3">
                {row.label}
            </th>
            <td className="py-3.5 align-top text-[15px] text-neutral-900">{row.value}</td>
        </tr>
    ));
    const footnote = data.footnote ? <p className="mt-3 text-[13px] text-neutral-500">{data.footnote}</p> : null;
    const heading = data.title && <h2 className="mb-2 text-xl font-semibold tracking-[-0.015em] text-neutral-900">{data.title}</h2>;

    if (visibleRows) {
        return (
            <section id="specifications" aria-label={data.title ?? "Specifications"}>
                {heading}
                <ExpandableTable
                    id="specifications-table"
                    hashId="specifications"
                    rows={rowElements}
                    visibleRows={visibleRows}
                    frameClassName="overflow-hidden"
                    tableClassName="w-full border-collapse"
                    footer={footnote}
                    moreLabel={`View full specifications (${rows.length} rows)`}
                    lessLabel="Show fewer specifications"
                />
            </section>
        );
    }

    return (
        <div>
            {heading}
            <div>
                <table className="w-full border-collapse">
                    <tbody>{rowElements}</tbody>
                </table>
            </div>
            {footnote}
        </div>
    );
}
