import { FAQ } from "@/components/misc";
import data from "@/data/faq.json";
import Link from "next/link";
import { PlaySquare, FileText, ArrowRight, FileTerminalIcon, MessageCircle } from "lucide-react";
import { ArticlesPageClient } from "../articles/ArticlesPageClient";
import { getMetadata } from "@/lib/metadata";
import { phone } from "@/data/site-config.json";

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
        <div className="mx-auto max-w-5xl space-y-14">

            {/* Service number banner */}
            <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 px-5 py-4">
                <MessageCircle className="h-5 w-5 shrink-0 text-primary-600" />
                <p className="text-sm text-neutral-700">
                    Online customer service:{" "}
                    <a href={`tel:${phone.service}`} className="font-semibold text-primary-600 hover:underline">
                        {phone.service}
                    </a>
                </p>
            </div>

            {/* Quick Resources */}
            <section>
                <div className="mb-6">
                    <h2 className="heading-3 text-neutral-900">Quick Resources</h2>
                    <p className="mt-1 text-sm text-neutral-500">Browse guides, articles, and policy documents</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {helpResources.map((resource) => {
                        const Icon = resource.icon;
                        return (
                            <Link
                                key={resource.id}
                                href={resource.href}
                                className="group flex items-start gap-4 rounded-xl border border-neutral-100 bg-white p-5 transition-all duration-200 hover:border-primary-200 hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                                        {resource.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-neutral-500">{resource.description}</p>
                                </div>
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-500" />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq">
                <FAQ
                    brands={data.brands}
                    title="Frequently Asked Questions"
                    subtitle="Find answers to the most common questions about our products and services."
                />
            </section>

            {/* Articles / Knowledge Base */}
            <section id="articles">
                <div className="mb-8">
                    <span className="label-tag label-tag-primary mb-4 inline-flex">Knowledge Base</span>
                    <h2 className="heading-2 text-neutral-900">Helpful Articles</h2>
                    <p className="mt-2 text-sm text-neutral-500">
                        Guides, tips, and resources about our products and services
                    </p>
                </div>
                <ArticlesPageClient />
            </section>

            {/* Still need help CTA */}
            <section className="rounded-2xl bg-navy-gradient p-8 text-center">
                <h3 className="heading-3 mb-2 text-white">Question not answered here?</h3>
                <p className="mb-6 text-sm text-navy-300">
                    Send us the details and a specialist will follow up directly.
                </p>
                <Link
                    href="/support/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-400"
                >
                    Contact Support
                    <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}
