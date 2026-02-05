interface InlineSpecificationsTableProps {
  title?: string;
  rows: Array<{ label: string; value: string }>;
}

/**
 * Compact inline specifications table for product cards/selectors
 * Different from SpecificationsTable which is a full-width block component
 */
export default function InlineSpecificationsTable({
  title,
  rows,
}: InlineSpecificationsTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div>
      {title && (
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">{title}</h3>
      )}
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-neutral-50" : "bg-white"}
              >
                <td className="w-1/3 px-3 py-2.5 font-medium text-neutral-600">
                  {row.label}
                </td>
                <td className="px-3 py-2.5 text-neutral-800">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
