import Link from "next/link";
import { CareBlock as CareBlockType } from "@/types";
import { ArrowRight } from "lucide-react";

interface CareBlockProps {
    data: CareBlockType["data"];
}

/** Care / maintenance steps — renders nothing unless the product has care data. */
export default function CareBlock({ data }: CareBlockProps) {
    const steps = data.steps?.filter(Boolean) ?? [];
    if (steps.length === 0) return null;

    return (
        <div>
            <h3 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-neutral-900">{data.title ?? "Care & maintenance"}</h3>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700 marker:text-neutral-500">
                {steps.map((step) => (
                    <li key={step}>{step}</li>
                ))}
            </ol>
            {data.guideHref && (
                <Link
                    href={data.guideHref}
                    className="group text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 mt-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    Read the full care guide
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            )}
        </div>
    );
}
