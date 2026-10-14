import Link from "next/link";
import { Check, ChevronRight, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import ContactForm from "./ContactForm";
import siteConfig from "@/data/site-config.json";
import { SURFACE_CARD } from "@/components/ui/surfaces";

interface BookingPageProps {
    eyebrow: string;
    title: string;
    intro: string;
    path: string;
    whatYouBook: string[];
    includeInMessage: string[];
    nextSteps: string[];
    form: {
        defaultSubject: string;
        messagePlaceholder: string;
        submitLabel: string;
        successTitle: string;
        successMessage: string;
        formName: string;
    };
    relatedLinks: { label: string; href: string }[];
}

/**
 * Conversion page wrapper for demo and loupe-fitting requests. Submissions go
 * through the standard contact form (same validation, lead storage and email
 * to the sales inbox) with a pre-filled subject that identifies the request.
 */
export default function BookingPage({ eyebrow, title, intro, path, whatYouBook, includeInMessage, nextSteps, form, relatedLinks }: BookingPageProps) {
    const phone = siteConfig.company.phone;

    return (
        <>
            <Breadcrumbs
                items={[
                    { name: "Home", path: "/" },
                    { name: title, path },
                ]}
            />
            <section className="bg-white">
                <div className="container pt-10 pb-10 md:pt-16 md:pb-14">
                    <p className="text-[15px] font-medium text-primary-700">{eyebrow}</p>
                    <h1 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">{title}</h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{intro}</p>
                </div>
            </section>

            <div className="bg-neutral-50">
                <div className="container grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-14">
                    {/* Explanation */}
                    <div className="space-y-10">
                        <section aria-labelledby="booking-what">
                            <h2 id="booking-what" className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">
                                What you are booking
                            </h2>
                            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-neutral-600">
                                {whatYouBook.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <Check className="mt-1 h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section aria-labelledby="booking-include">
                            <h2 id="booking-include" className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">
                                What to include in your request
                            </h2>
                            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-neutral-600">
                                {includeInMessage.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <Check className="mt-1 h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section aria-labelledby="booking-next">
                            <h2 id="booking-next" className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">
                                What happens next
                            </h2>
                            <ol className="mt-4 space-y-4">
                                {nextSteps.map((step, index) => (
                                    <li key={step} className="flex gap-3.5 text-[15px] leading-relaxed text-neutral-600">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[13px] font-semibold text-primary-800 tabular-nums">
                                            {index + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <div className={`${SURFACE_CARD} p-6`}>
                            <p className="text-[15px] text-neutral-600">Prefer to talk? Call the Haitech team.</p>
                            <a
                                href={`tel:${phone.replace(/\s/g, "")}`}
                                className="mt-1 -ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-lg font-semibold tracking-[-0.01em] text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" />
                                {phone}
                            </a>
                        </div>

                        {relatedLinks.length > 0 && (
                            <nav aria-label="Related pages">
                                <ul className="divide-y divide-neutral-900/[0.06]">
                                    {relatedLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group flex min-h-12 items-center justify-between gap-3 rounded-md text-[15px] font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                                            >
                                                {link.label}
                                                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>

                    {/* Form */}
                    <div className={`${SURFACE_CARD} p-6 md:p-10`}>
                        <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[1.75rem]">Your details</h2>
                        <p className="mt-2 mb-8 text-[15px] leading-relaxed text-neutral-500">Fields marked * are required. We typically reply within 24 hours.</p>
                        <ContactForm messageLabel="Your request" {...form} />
                    </div>
                </div>
            </div>
        </>
    );
}
