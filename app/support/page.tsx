import { Phone, Mail, Clock, ChevronRight } from "lucide-react";
import siteConfig from "@/data/site-config.json";
import { getMetadata } from "@/lib/metadata";
import { SupportSectionsGrid } from "@/components/support";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";
import Link from "next/link";

export const metadata = getMetadata("support");

const quickContacts = [
    {
        icon: Phone,
        title: "Call Us",
        value: siteConfig.company.phone,
        href: `tel:${siteConfig.company.phone.replace(/\s/g, "")}`,
        description: "Mon–Fri, 10am–6pm IST",
    },
    {
        icon: Mail,
        title: "Email Us",
        value: siteConfig.company.email,
        href: `mailto:${siteConfig.company.email}`,
        description: "We reply within 24 hours",
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "Mon–Fri, 10am–6pm",
        description: "Indian Standard Time (IST)",
    },
];

export default function SupportPage() {
    return (
        <div className="space-y-16 md:space-y-20">
            {/* Topics */}
            <SupportSectionsGrid />

            {/* Quick Contact */}
            <section aria-labelledby="quick-contact-heading">
                <div className="mb-6 md:mb-8">
                    <h2 id="quick-contact-heading" className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[1.75rem]">
                        Quick Contact
                    </h2>
                    <p className="mt-2 text-base text-neutral-500">Reach us by your preferred method</p>
                </div>
                <ul className="grid gap-5 sm:grid-cols-3 md:gap-6">
                    {quickContacts.map((c) => {
                        const Icon = c.icon;
                        const content = (
                            <>
                                <Icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                                <p className="mt-5 text-[13px] font-medium text-neutral-500">{c.title}</p>
                                <p className="mt-1 text-[17px] font-semibold tracking-[-0.01em] break-words text-neutral-900">{c.value}</p>
                                <p className="mt-1 text-[13px] text-neutral-500">{c.description}</p>
                            </>
                        );
                        return (
                            <li key={c.title} className="flex">
                                {c.href ? (
                                    <a href={c.href} className={`${INTERACTIVE_CARD} w-full p-6`}>
                                        <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                        {content}
                                    </a>
                                ) : (
                                    <div className={`${SURFACE_CARD} flex w-full flex-col p-6`}>{content}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Still need help */}
            <section className="rounded-3xl bg-neutral-50 px-6 py-12 text-center md:px-12 md:py-16">
                <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[2rem]">Can&apos;t find what you&apos;re looking for?</h2>
                <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-neutral-600 md:text-[17px]">
                    Call {siteConfig.company.phone} or email us — we typically reply within 24 hours.
                </p>
                <Link href="/support/contact" className={`${PILL_PRIMARY} mt-8`}>
                    Contact Support
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}
