import Link from "next/link";
import { Headset, LifeBuoy, FileCheck, ArrowRight, Phone, Mail, Clock } from "lucide-react";
import siteConfig from "@/data/site-config.json";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("support");

const supportSections = [
    {
        id: "contact",
        title: "Contact Us",
        description: "Get in touch with our support team for personalized assistance",
        icon: Headset,
        path: "/support/contact",
        color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    },
    {
        id: "help",
        title: "Help Center",
        description: "Browse FAQs, guides, and articles to find answers",
        icon: LifeBuoy,
        path: "/support/faq",
        color: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
    },
    {
        id: "policies",
        title: "Policies",
        description: "Review our privacy policy and other important information",
        icon: FileCheck,
        path: "/support/policies",
        color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    },
];

export default function SupportPage() {
    return (
        <div className="space-y-16">
            {/* Quick Links Section */}
            <section className="grid gap-6 md:grid-cols-3">
                {supportSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link key={section.id} href={section.path} className="group card flex flex-col p-6 transition-all duration-300 hover:shadow-lg">
                            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${section.color}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="heading-4 group-hover:text-primary-600 mb-2 transition-colors">{section.title}</h3>
                            <p className="text-muted flex-1 text-sm">{section.description}</p>
                            <div className="text-primary-600 mt-4 flex items-center text-sm font-medium">
                                <span>Learn more</span>
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    );
                })}
            </section>

            {/* Quick Contact Info */}
            <section className="bg-surface-secondary rounded-2xl p-8">
                <h2 className="heading-3 mb-8 text-center">Quick Contact</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Phone */}
                    <div className="flex items-center gap-4 rounded-xl bg-white p-4">
                        <div className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                            <Phone className="text-primary-600 h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-muted text-sm">Call Us</p>
                            <p className="font-semibold">{siteConfig.company.phone}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4 rounded-xl bg-white p-4">
                        <div className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                            <Mail className="text-primary-600 h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-muted text-sm">Email Us</p>
                            <p className="font-semibold">{siteConfig.company.email}</p>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-center gap-4 rounded-xl bg-white p-4">
                        <div className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                            <Clock className="text-primary-600 h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-muted text-sm">Business Hours</p>
                            <p className="font-semibold">Mon-Fri 9am-6pm</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
