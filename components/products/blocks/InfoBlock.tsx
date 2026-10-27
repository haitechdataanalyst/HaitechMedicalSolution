import { InfoBlock as InfoBlockType } from "@/types";
import { CheckIcon } from "@/components/icons";
import { linkAdmetec } from "@/components/brand/AdmetecText";

interface InfoBlockProps {
    data: InfoBlockType["data"];
}

export default function InfoBlock({ data }: InfoBlockProps) {
    const hasPackageContents = Boolean(data.packageContents && data.packageContents.length > 0);
    if (!data.manufacturer && !data.warranty && !hasPackageContents) return null;

    return (
        <dl className="divide-y divide-neutral-900/[0.06]">
            {data.manufacturer && (
                <div className="grid grid-cols-[2fr_3fr] py-3.5 sm:grid-cols-[1fr_2fr]">
                    <dt className="pr-4 text-[15px] text-neutral-500">Manufacturer</dt>
                    <dd className="text-[15px] text-neutral-900">{linkAdmetec(data.manufacturer)}</dd>
                </div>
            )}

            {data.warranty && (
                <div className="grid grid-cols-[2fr_3fr] py-3.5 sm:grid-cols-[1fr_2fr]">
                    <dt className="pr-4 text-[15px] text-neutral-500">Warranty</dt>
                    <dd className="text-[15px] text-neutral-900">{linkAdmetec(data.warranty)}</dd>
                </div>
            )}

            {hasPackageContents && (
                <div className="grid grid-cols-[2fr_3fr] py-3.5 sm:grid-cols-[1fr_2fr]">
                    <dt className="pr-4 text-[15px] text-neutral-500">Package contents</dt>
                    <dd>
                        <ul className="space-y-1.5">
                            {data.packageContents!.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-[15px] text-neutral-900">
                                    <CheckIcon size={16} className="text-primary-700 mt-0.5 shrink-0" />
                                    {linkAdmetec(item)}
                                </li>
                            ))}
                        </ul>
                    </dd>
                </div>
            )}
        </dl>
    );
}
