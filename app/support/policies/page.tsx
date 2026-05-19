import Link from "next/link";
import { Shield, ArrowRight, FileText } from "lucide-react";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportPolicies");

const policies = [
    {
        id: "privacy",
        icon: Shield,
        title: "Privacy Policy",
        description: "Learn how we collect, use, and protect your personal information.",
        href: "/support/policies/privacy",
        accent: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
        lastUpdated: "January 2026",
    },
    {
        id: "terms",
        icon: FileText,
        title: "Terms of Service",
        description: "Read the terms and regulations for using our services.",
        href: "/support/policies/terms",
        accent: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
        lastUpdated: "February 2026",
    },
];

export default function PoliciesPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Policy Cards */}
            <section className="space-y-4">
                {policies.map((policy) => {
                    const Icon = policy.icon;
                    return (
                        <Link
                            key={policy.id}
                            href={policy.href}
                            className="group flex items-center gap-6 rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:border-primary-100 hover:shadow-lg"
                        >
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors ${policy.accent}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                                    {policy.title}
                                </h3>
                                <p className="mt-1 text-sm text-neutral-500">{policy.description}</p>
                                <p className="mt-1.5 text-xs text-neutral-400">Last updated: {policy.lastUpdated}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 shrink-0 text-neutral-300 transition-all group-hover:translate-x-1 group-hover:text-primary-500" />
                        </Link>
                    );
                })}
            </section>

            {/* Questions */}
            <section className="rounded-2xl border border-neutral-100 bg-neutral-50 p-8">
                <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="mb-2 font-semibold text-neutral-900">Questions about our policies?</h3>
                        <p className="mb-4 text-sm text-neutral-500">
                            If you have any questions or need clarification on any terms, our support team is here to help.
                        </p>
                        <Link
                            href="/support/contact"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                        >
                            Contact Support
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
