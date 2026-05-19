import { Phone, Mail, Clock, ArrowRight } from "lucide-react";
import siteConfig from "@/data/site-config.json";
import { getMetadata } from "@/lib/metadata";
import { SupportSectionsGrid } from "@/components/support";
import Link from "next/link";

export const metadata = getMetadata("support");

const quickContacts = [
    {
        icon: Phone,
        title: "Call Us",
        value: siteConfig.company.phone,
        href: `tel:${siteConfig.company.phone.replace(/\s/g, "")}`,
        description: "Mon–Fri, 10am–6pm IST",
        color: "bg-primary-50 text-primary-600",
    },
    {
        icon: Mail,
        title: "Email Us",
        value: siteConfig.company.email,
        href: `mailto:${siteConfig.company.email}`,
        description: "We reply within 24 hours",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "Mon–Fri: 10am – 6pm",
        description: "Indian Standard Time (IST)",
        color: "bg-emerald-50 text-emerald-600",
    },
];

export default function SupportPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-14">
            {/* Section grid */}
            <SupportSectionsGrid />

            {/* Quick Contact */}
            <section>
                <div className="mb-6">
                    <h2 className="heading-3 text-neutral-900">Quick Contact</h2>
                    <p className="mt-1 text-sm text-neutral-500">Reach us by your preferred method</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    {quickContacts.map((c) => {
                        const Icon = c.icon;
                        const content = (
                            <div className="flex items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-200 hover:border-neutral-200 hover:shadow-md">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{c.title}</p>
                                    <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900">{c.value}</p>
                                    <p className="mt-0.5 text-xs text-neutral-400">{c.description}</p>
                                </div>
                            </div>
                        );
                        return c.href ? (
                            <a key={c.title} href={c.href}>{content}</a>
                        ) : (
                            <div key={c.title}>{content}</div>
                        );
                    })}
                </div>
            </section>

            {/* Still need help */}
            <section className="rounded-2xl bg-navy-gradient p-8 text-center">
                <h3 className="heading-3 mb-2 text-white">Can&apos;t find what you&apos;re looking for?</h3>
                <p className="mb-6 text-sm text-navy-300">Our support team is ready to help with any question.</p>
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
