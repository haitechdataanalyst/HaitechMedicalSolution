import { AudienceBlock as AudienceBlockType } from "@/types";
import { CheckIcon } from "@/components/icons";
import { X } from "lucide-react";

interface AudienceBlockProps {
    data: AudienceBlockType["data"];
}

/** "Who it's for" — renders nothing unless the product has audience data. */
export default function AudienceBlock({ data }: AudienceBlockProps) {
    const suited = data.suitedFor?.filter(Boolean) ?? [];
    const notSuited = data.notSuitedFor?.filter(Boolean) ?? [];
    if (suited.length === 0 && notSuited.length === 0) return null;

    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-neutral-900">Who it&apos;s for</h3>
            <div className="grid gap-6 rounded-2xl bg-neutral-50 p-5 sm:grid-cols-2 sm:p-6">
                {suited.length > 0 && (
                    <div>
                        <h4 className="mb-2.5 text-[15px] font-semibold text-neutral-900">A good fit for</h4>
                        <ul className="space-y-2">
                            {suited.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-[15px] leading-relaxed text-neutral-700">
                                    <CheckIcon size={16} className="text-primary-700 mt-1 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {notSuited.length > 0 && (
                    <div>
                        <h4 className="mb-2.5 text-[15px] font-semibold text-neutral-900">Consider another option if</h4>
                        <ul className="space-y-2">
                            {notSuited.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-[15px] leading-relaxed text-neutral-700">
                                    <X className="mt-1 h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
