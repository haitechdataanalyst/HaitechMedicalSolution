import { InfoBlock as InfoBlockType } from "@/types";
import { CheckIcon } from "@/components/icons";

interface InfoBlockProps {
  data: InfoBlockType["data"];
}

export default function InfoBlock({ data }: InfoBlockProps) {
  return (
    <div className="bg-surface-secondary space-y-4 rounded-xl p-4 sm:p-6">
      {data.manufacturer && (
        <div>
          <h4 className="text-muted text-sm font-medium tracking-wide uppercase">Manufacturer</h4>
          <p className="text-foreground mt-1">{data.manufacturer}</p>
        </div>
      )}

      {data.warranty && (
        <div>
          <h4 className="text-muted text-sm font-medium tracking-wide uppercase">Warranty</h4>
          <p className="text-foreground mt-1">{data.warranty}</p>
        </div>
      )}

      {data.packageContents && data.packageContents.length > 0 && (
        <div>
          <h4 className="text-muted text-sm font-medium tracking-wide uppercase">Package Contents</h4>
          <ul className="mt-2 space-y-1">
            {data.packageContents.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-neutral-700">
                <CheckIcon size={16} className="text-success mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
