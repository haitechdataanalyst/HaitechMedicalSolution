import { SpecificationsBlock as SpecificationsBlockType } from "@/types";

interface SpecificationsTableProps {
    data: SpecificationsBlockType["data"];
}

export default function SpecificationsTable({ data }: SpecificationsTableProps) {
    // Handle both 'rows' and 'specs' field names for backwards compatibility
    const rows = (data as any).rows ?? (data as any).specs ?? [];

    if (rows.length === 0) {
        return null;
    }

    return (
        <div>
            {data.title && <h3 className="text-foreground mb-4 text-lg font-semibold">{data.title}</h3>}
            <div className="overflow-hidden rounded-lg border border-neutral-200">
                <table className="w-full">
                    <tbody>
                        {rows.map((row: { label: string; value: string }, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-surface-secondary" : "bg-surface"}>
                                <td className="w-2/5 px-3 py-3 text-sm font-medium text-neutral-600 sm:w-1/3 sm:px-4">{row.label}</td>
                                <td className="text-foreground px-3 py-3 text-sm sm:px-4">{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
