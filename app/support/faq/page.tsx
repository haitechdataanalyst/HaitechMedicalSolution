import { FAQ } from "@/components/misc";
import data from "@/data/faq.json";
import Link from "next/link";
import { PlaySquare, FileText, ArrowRight, FileTerminalIcon } from "lucide-react";
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
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "articles",
        icon: FileText,
        title: "Knowledge Base",
        description: "In-depth articles and documentation",
        href: "#articles",
        color: "bg-green-50 text-green-600",
    },
    {
        id: "terms",
        icon: FileTerminalIcon,
        title: "Policies",
        description: "Our Policies & terms and Conditions",
        href: "/support/policies",
        color: "bg-purple-50 text-purple-600",
    },
];

export default function HelpCenterPage() {
    return (
        <div className="mx-auto max-w-5xl">
            <section className="bg-primary-50 mb-4 rounded-xl border border-neutral-200 p-4 text-center">
                <p className="text-sm font-medium text-neutral-800">
                    To connect with our online customer service please call us at :
                    <a href={`tel:${phone.service}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        {phone.service}
                    </a>
                </p>
            </section>

            {/* Quick Resources */}
            <section className="mb-12 grid gap-4 md:grid-cols-3">
                {helpResources.map((resource) => {
                    const Icon = resource.icon;
                    return (
                        <Link
                            key={resource.id}
                            href={resource.href}
                            // id={resource.id}
                            className="group hover:border-primary-300 flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${resource.color}`}>
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="group-hover:text-primary-600 text-sm font-semibold transition-colors">{resource.title}</h3>
                                <p className="text-muted mt-0.5 text-xs">{resource.description}</p>
                            </div>
                            <ArrowRight className="text-muted group-hover:text-primary-600 mt-1 h-4 w-4 shrink-0 transition-all group-hover:translate-x-1" />
                        </Link>
                    );
                })}
            </section>

            {/* FAQ Section */}
            <section id="faq">
                <FAQ faqs={data.faqs} title="Frequently Asked Questions" subtitle="Find answers to the most common questions about our products and services." />
            </section>

            {/* Articles Section */}
            <section id="articles" className="mt-12">
                <div className="mb-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900">Knowledge Base</h2>
                    <p className="mx-auto max-w-2xl text-gray-600">Find helpful articles, guides, and resources about our products and services</p>
                </div>
                <ArticlesPageClient />
            </section>

            {/* Still need help CTA */}
            <section className="bg-primary-50 mt-12 rounded-2xl p-8 text-center">
                <h3 className="heading-4 mb-2">Still need help?</h3>
                <p className="text-muted mb-4">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
                <Link href="/support/contact" className="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium text-white transition-colors">
                    Contact Support
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </section>
        </div>
    );
}
