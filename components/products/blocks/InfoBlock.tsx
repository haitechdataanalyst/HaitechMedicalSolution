import { InfoBlock as InfoBlockType } from "@/types";
import { CheckIcon } from "@/components/icons";
import { Factory, ShieldCheck, Package } from "lucide-react";

interface InfoBlockProps {
    data: InfoBlockType["data"];
}

export default function InfoBlock({ data }: InfoBlockProps) {
    const hasPackageContents = Boolean(data.packageContents && data.packageContents.length > 0);
    if (!data.manufacturer && !data.warranty && !hasPackageContents) return null;

    return (
        <div className="card divide-y divide-neutral-100">
            {data.manufacturer && (
                <div className="flex items-start gap-3 p-4 sm:p-5">
                    <Factory className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    <div>
                        <h4 className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">Manufacturer</h4>
                        <p className="mt-0.5 text-sm font-medium text-neutral-800">{data.manufacturer}</p>
                    </div>
                </div>
            )}

            {data.warranty && (
                <div className="flex items-start gap-3 p-4 sm:p-5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    <div>
                        <h4 className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">Warranty</h4>
                        <p className="mt-0.5 text-sm font-medium text-neutral-800">{data.warranty}</p>
                    </div>
                </div>
            )}

            {hasPackageContents && (
                <div className="flex items-start gap-3 p-4 sm:p-5">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                        <h4 className="mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Package Contents</h4>
                        <ul className="space-y-1.5">
                            {data.packageContents!.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                                    <CheckIcon size={15} className="text-success mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
