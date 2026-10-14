import { MIN_FEATURED_ON_HOMEPAGE, MIN_STORIES_TO_PUBLISH } from "@/lib/customer-stories";
import type { HeldStory } from "@/lib/customer-stories";

interface DevPreviewNoticeProps {
    held: HeldStory[];
    /** Why this surface is not live yet, in addition to the generic message. */
    detail?: string;
}

/** Amber banner shown only in the development preview. Deliberately un-branded so it can never pass as real content. */
export default function DevPreviewNotice({ held, detail }: DevPreviewNoticeProps) {
    return (
        <div role="note" className="mb-8 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-950 md:p-5">
            <p className="font-semibold">DEVELOPMENT PREVIEW — layout only. Not visible in production.</p>
            <p className="mt-1">
                Placeholders only, no real customers. The customer-stories page goes live once at least {MIN_STORIES_TO_PUBLISH} stories in <code>data/customer-stories.json</code> pass every approval
                check, and the homepage section needs at least {MIN_FEATURED_ON_HOMEPAGE} of them marked <code>featured</code>.
            </p>
            {detail && <p className="mt-1 font-medium">{detail}</p>}
            {held.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5">
                    {held.map((entry) => (
                        <li key={entry.id}>
                            <strong>{entry.id}</strong> is held back: {entry.reasons.join("; ")}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
