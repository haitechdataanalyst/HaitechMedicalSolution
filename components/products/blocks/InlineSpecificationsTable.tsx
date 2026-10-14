interface InlineSpecificationsTableProps {
    title?: string;
    rows: Array<{ label: string; value: string }>;
}

/**
 * Compact inline specifications table for product cards/selectors
 * Different from SpecificationsTable which is a full-width block component
 */
export default function InlineSpecificationsTable({ title, rows }: InlineSpecificationsTableProps) {
    if (rows.length === 0) {
        return null;
    }

    return (
        <div>
            {title && <h3 className="mb-1 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{title}</h3>}
            <table className="w-full border-collapse text-[15px]">
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-neutral-900/[0.06] last:border-b-0">
                            <th scope="row" className="w-2/5 py-3 pr-4 text-left align-top font-normal text-neutral-500">
                                {row.label}
                            </th>
                            <td className="py-3 align-top text-neutral-900">{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
