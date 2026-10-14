import Link from "next/link";
import { Shield, ChevronRight, FileText } from "lucide-react";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import { cn } from "@/lib/utils";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportPolicies");

const policies = [
    {
        id: "privacy",
        icon: Shield,
        title: "Privacy Policy",
        description: "Learn how we collect, use, and protect your personal information.",
        href: "/support/policies/privacy",
        lastUpdated: "January 2026",
    },
    {
        id: "terms",
        icon: FileText,
        title: "Terms of Service",
        description: "Read the terms and regulations for using our services.",
        href: "/support/policies/terms",
        lastUpdated: "February 2026",
    },
];

export default function PoliciesPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-12">
            {/* Policy Cards */}
            <ul className="space-y-4">
                {policies.map((policy) => {
                    const Icon = policy.icon;
                    return (
                        <li key={policy.id}>
                            <Link href={policy.href} className={cn(INTERACTIVE_CARD, "flex-row items-center gap-5 p-6 md:p-7")}>
                                <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                <Icon className="h-6 w-6 shrink-0 text-primary-700" strokeWidth={1.6} aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{policy.title}</h2>
                                    <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">{policy.description}</p>
                                    <p className="mt-2 text-[13px] text-neutral-500">Last updated: {policy.lastUpdated}</p>
                                </div>
                                <ChevronRight
                                    className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Questions */}
            <section className="rounded-3xl bg-neutral-50 p-8 md:p-10">
                <h2 className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">Questions about our policies?</h2>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-neutral-600">
                    If you have any questions or need clarification on any terms, our support team is here to help.
                </p>
                <Link
                    href="/support/contact"
                    className="mt-4 -ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[15px] font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                    Contact Support
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}
