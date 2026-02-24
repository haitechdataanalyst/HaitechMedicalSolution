import Link from "next/link";
import { Shield, ArrowRight, FileText } from "lucide-react";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportPolicies");

const policies = [
    {
        id: "privacy",
        icon: Shield,
        title: "Privacy Policy",
        description: "Learn how we collect, use, and protect your personal information",
        href: "/support/policies/privacy",
        color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
        lastUpdated: "January 2026",
    },
    {
        id: "terms",
        icon: FileText,
        title: "Terms of Service",
        description: "Read the rules and regulations for using our services",
        href: "/support/policies/terms",
        color: "bg-green-50 text-green-600 group-hover:bg-green-100",
        lastUpdated: "February 2026",
    },
];

export default function PoliciesPage() {
    return (
        <div className="mx-auto max-w-4xl">
            {/* Policy Cards */}
            <section className="space-y-4">
                {policies.map((policy) => {
                    const Icon = policy.icon;
                    return (
                        <Link
                            key={policy.id}
                            href={policy.href}
                            className="group hover:border-primary-300 flex items-center gap-6 rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors ${policy.color}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="group-hover:text-primary-600 text-lg font-semibold transition-colors">{policy.title}</h3>
                                <p className="text-muted mt-1 text-sm">{policy.description}</p>
                                <p className="text-subtle mt-2 text-xs">Last updated: {policy.lastUpdated}</p>
                            </div>
                            <ArrowRight className="text-muted group-hover:text-primary-600 h-5 w-5 shrink-0 transition-all group-hover:translate-x-2" />
                        </Link>
                    );
                })}
            </section>

            {/* Additional Info */}
            <section className="bg-surface-secondary mt-12 space-y-10 rounded-2xl p-8">
                {/* Details Anchors */}

                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                        <FileText className="text-primary-600 h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="mb-2 font-semibold">Questions about our policies?</h3>
                        <p className="text-muted mb-4 text-sm">
                            If you have any questions about our policies or need clarification on any terms, please don&apos;t hesitate to contact our support team.
                        </p>
                        <Link href="/support/contact" className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2 text-sm font-medium">
                            Contact Support
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
