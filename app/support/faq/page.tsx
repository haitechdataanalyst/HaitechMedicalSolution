import { FAQ } from "@/components/misc";
import data from "@/data/faq.json";
import Link from "next/link";
import { PlaySquare, FileText, ChevronRight, FileTerminalIcon, MessageCircle } from "lucide-react";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_PRIMARY } from "@/components/ui/surfaces";
import { ArticlesPageClient } from "../articles/ArticlesPageClient";
import { getMetadata } from "@/lib/metadata";
import { phone } from "@/data/site-config.json";
import { JsonLd } from "@/components/ui";
import { faqSchema, flattenFaqGroup } from "@/lib/structured-data";

export const metadata = getMetadata("supportFaq");

const helpResources = [
    {
        id: "guides",
        icon: PlaySquare,
        title: "Product Guides",
        description: "Step-by-step tutorials and video guides for our products",
        href: "#guides",
    },
    {
        id: "articles",
        icon: FileText,
        title: "Knowledge Base",
        description: "In-depth articles and documentation",
        href: "#articles",
    },
    {
        id: "terms",
        icon: FileTerminalIcon,
        title: "Policies",
        description: "Privacy policy, terms & conditions",
        href: "/support/policies",
    },
];

export default function HelpCenterPage() {
    return (
        <div className="space-y-16 md:space-y-20">
            {/* The accordion opens on its first tab, so that tab's questions are the ones on the page; marked up from the same data. */}
            <JsonLd data={faqSchema(flattenFaqGroup(data.categories[0]))} />

            {/* Service number banner */}
            <div className="flex items-center gap-3 rounded-2xl bg-primary-50 px-5 py-4">
                <MessageCircle className="h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
                <p className="text-[15px] text-neutral-700">
                    Online customer service:{" "}
                    <a href={`tel:${phone.service}`} className="font-semibold text-primary-800 underline-offset-4 hover:underline">
                        {phone.service}
                    </a>
                </p>
            </div>

            {/* Quick Resources */}
            <section aria-labelledby="quick-resources-heading">
                <div className="mb-6 md:mb-8">
                    <h2 id="quick-resources-heading" className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[1.75rem]">
                        Quick Resources
                    </h2>
                    <p className="mt-2 text-base text-neutral-500">Browse guides, articles, and policy documents</p>
                </div>
                <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
                    {helpResources.map((resource) => {
                        const Icon = resource.icon;
                        return (
                            <li key={resource.id} className="flex">
                                <Link href={resource.href} className={`${INTERACTIVE_CARD} w-full p-6`}>
                                    <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                    <Icon className="h-6 w-6 text-primary-700" strokeWidth={1.6} aria-hidden="true" />
                                    <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{resource.title}</h3>
                                    <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-neutral-600">{resource.description}</p>
                                    <ChevronRight
                                        className="mt-4 h-4 w-4 text-primary-700 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="overflow-hidden rounded-3xl">
                <FAQ groups={data.categories} searchable title="Frequently Asked Questions" subtitle="Find answers to the most common questions about our products and services." />
            </section>

            {/* Articles / Knowledge Base */}
            <section id="articles" aria-labelledby="articles-heading">
                <div className="mb-8 md:mb-10">
                    <h2 id="articles-heading" className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">
                        Helpful Articles
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-neutral-500 md:text-lg">Guides, tips, and resources about our products and services</p>
                </div>
                <ArticlesPageClient />
            </section>

            {/* Still need help CTA */}
            <section className="rounded-3xl bg-neutral-50 px-6 py-12 text-center md:px-12 md:py-16">
                <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[2rem]">Question not answered here?</h2>
                <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-neutral-600 md:text-[17px]">Send us the details and a specialist will follow up directly.</p>
                <Link href="/support/contact" className={`${PILL_PRIMARY} mt-8`}>
                    Contact Support
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}
