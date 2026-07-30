import { SpecificationsBlock as SpecificationsBlockType } from "@/types";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecificationsTableProps {
    data: SpecificationsBlockType["data"];
}

export default function SpecificationsTable({ data }: SpecificationsTableProps) {
    // Handle both 'rows' and 'specs' field names for backwards compatibility
    const rows = data.rows ?? data.specs ?? [];

    if (rows.length === 0) {
        return null;
    }

    return (
        <div>
            {data.title && (
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                    <ClipboardList className="h-4 w-4 text-primary-500" aria-hidden="true" />
                    {data.title}
                </h3>
            )}
            <div className="card overflow-hidden">
                <table className="w-full border-collapse">
                    <tbody>
                        {rows.map((row: { label: string; value: string }, index: number) => (
                            <tr
                                key={index}
                                className={cn(
                                    "transition-colors hover:bg-primary-50/40",
                                    index % 2 === 0 ? "bg-white" : "bg-neutral-50/60"
                                )}
                            >
                                <td className="w-2/5 px-4 py-3 text-sm font-medium text-neutral-500 sm:w-1/3 sm:px-5">{row.label}</td>
                                <td className="px-4 py-3 text-sm font-medium text-neutral-800 sm:px-5">{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
