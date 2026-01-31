import { DescriptionBlock as DescriptionBlockType } from '@/types';

interface DescriptionBlockProps {
  data: DescriptionBlockType['data'];
}

export default function DescriptionBlock({ data }: DescriptionBlockProps) {
  return (
    <div className="space-y-4">
      <p className="text-neutral-700 leading-relaxed">{data.primary}</p>
      {data.secondary && (
        <p className="text-muted leading-relaxed">{data.secondary}</p>
      )}
    </div>
  );
}
