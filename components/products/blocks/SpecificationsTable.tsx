import { SpecificationsBlock as SpecificationsBlockType } from '@/types';

interface SpecificationsTableProps {
  data: SpecificationsBlockType['data'];
}

export default function SpecificationsTable({ data }: SpecificationsTableProps) {
  // Guard against missing rows
  if (!data.rows || data.rows.length === 0) {
    return null;
  }

  return (
    <div>
      {data.title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{data.title}</h3>
      )}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {data.rows.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-surface-secondary' : 'bg-surface'}
              >
                <td className="px-3 sm:px-4 py-3 text-sm font-medium text-neutral-600 w-2/5 sm:w-1/3">
                  {row.label}
                </td>
                <td className="px-3 sm:px-4 py-3 text-sm text-foreground">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
