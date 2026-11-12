import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, Check, ChevronRight, ExternalLink, IndianRupee, ShieldCheck, Truck } from "lucide-react";
import { type AdmetecVideo as AdmetecVideoData, watchTime } from "@/lib/admetec-videos";
import { shouldShowPrice } from "@/lib/config";
import { videoSchema } from "@/lib/structured-data";
import { linkAdmetec } from "@/components/brand/AdmetecText";
import JsonLd from "@/components/ui/JsonLd";
import { PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";

interface IndiaFact {
    icon: ReactNode;
    title: string;
    body: string;
}

/** What a buyer in India needs next to a video. Each line restates something the site already says (product info blocks, loupe FAQ, fitting page). */
function indiaFacts(): IndiaFact[] {
    const icon = "h-5 w-5";
    return [
        ...(shouldShowPrice("Admetec") ? [{ icon: <IndianRupee className={icon} />, title: "Priced in INR", body: "Loupe prices are listed including GST." }] : []),
        { icon: <ShieldCheck className={icon} />, title: "5-year warranty", body: "All-inclusive, through the Admetec Guarantee." },
        { icon: <Truck className={icon} />, title: "6 to 8 weeks", body: "To make and ship your loupes, with tracking." },
        { icon: <CalendarCheck className={icon} />, title: "Fitting or demo", body: "Book with the Haitech team. We typically reply within 24 hours." },
    ];
}

/**
 * One Admetec video beside the text that explains it: the film, what it covers, and what a buyer in India gets.
 * No autoplay and no custom controls: YouTube's own player, from the privacy-friendly domain, loaded only near the screen.
 * The caller supplies the band or container it sits in.
 */
export function AdmetecVideo({ video, showIndiaFacts = true }: { video: AdmetecVideoData; showIndiaFacts?: boolean }) {
    const headingId = `admetec-video-${video.id}`;
    const facts = indiaFacts();

    return (
        <section aria-labelledby={headingId} className={`${SURFACE_CARD} overflow-hidden p-4 md:p-6 lg:p-8`}>
            <JsonLd data={videoSchema({ id: video.id, name: video.heading, description: video.summary, uploadDate: video.uploadDate, seconds: video.seconds })} />

            <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
                <div className="lg:col-span-7">
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-900/[0.08]">
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                            title={`${video.heading} (video by Admetec)`}
                            loading="lazy"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="absolute inset-0 h-full w-full"
                        />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 text-[13px] text-neutral-500">
                        <span>Video by {linkAdmetec("Admetec")}</span>
                        <a
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener"
                            className="hover:text-primary-700 focus-visible:outline-primary-500 -mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            Watch on YouTube
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">(opens in a new tab)</span>
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <p className="text-primary-700 text-[15px] font-medium">Watch · {watchTime(video.seconds)}</p>
                    <h2 id={headingId} className="mt-2 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-balance text-neutral-900 md:text-[2rem]">
                        {video.heading}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-neutral-600">{linkAdmetec(video.summary)}</p>
                    <ul className="mt-5 space-y-2.5">
                        {video.points.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700">
                                <Check className="text-primary-700 mt-1 h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2.5} />
                                <span>{linkAdmetec(point)}</span>
                            </li>
                        ))}
                    </ul>
                    {video.cta && (
                        <Link href={video.cta.href} className={`${PILL_PRIMARY} mt-6`}>
                            {video.cta.label}
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </div>

            {showIndiaFacts && (
                <div className="mt-8 border-t border-neutral-900/[0.06] pt-6">
                    <h3 className="text-[13px] font-medium text-neutral-500">For buyers in India</h3>
                    <ul className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                        {facts.map((fact) => (
                            <li key={fact.title} className="flex items-start gap-3">
                                <span className="text-primary-700 mt-0.5 shrink-0" aria-hidden="true">
                                    {fact.icon}
                                </span>
                                <span>
                                    <span className="block text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{fact.title}</span>
                                    <span className="mt-0.5 block text-[13px] leading-relaxed text-neutral-500">{linkAdmetec(fact.body)}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
