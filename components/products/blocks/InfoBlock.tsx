import { InfoBlock as InfoBlockType } from '@/types';
import { CheckIcon } from '@/components/icons';

interface InfoBlockProps {
  data: InfoBlockType['data'];
}

export default function InfoBlock({ data }: InfoBlockProps) {
  return (
    <div className="bg-surface-secondary rounded-xl p-4 sm:p-6 space-y-4">
      {data.manufacturer && (
        <div>
          <h4 className="text-sm font-medium text-muted uppercase tracking-wide">
            Manufacturer
          </h4>
          <p className="mt-1 text-[var(--foreground)]">{data.manufacturer}</p>
        </div>
      )}

      {data.warranty && (
        <div>
          <h4 className="text-sm font-medium text-muted uppercase tracking-wide">
            Warranty
          </h4>
          <p className="mt-1 text-[var(--foreground)]">{data.warranty}</p>
        </div>
      )}

      {data.packageContents && data.packageContents.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted uppercase tracking-wide">
            Package Contents
          </h4>
          <ul className="mt-2 space-y-1">
            {data.packageContents.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-neutral-700">
                <CheckIcon size={16} className="text-success flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
