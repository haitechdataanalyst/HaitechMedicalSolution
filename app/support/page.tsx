import { Phone, Mail, Clock } from "lucide-react";
import siteConfig from "@/data/site-config.json";
import { getMetadata } from "@/lib/metadata";
import { SupportSectionsGrid } from "@/components/support";

export const metadata = getMetadata("support");

export default function SupportPage() {
    return (
        <div className="space-y-16">
            {/* Quick Links Section */}
            <SupportSectionsGrid />

            {/* Quick Contact Info */}
            <section aria-label="Quick contact" className="bg-surface-tertiary rounded-2xl px-3 py-10 sm:p-8">
                <h2 className="heading-3 mb-8 text-center">Quick Contact</h2>
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6">
                    {/* Phone */}
                    <a href={`tel:${siteConfig.company.phone}`} className="flex w-full min-w-72 items-center gap-3 rounded-xl bg-white p-4 whitespace-nowrap transition-shadow hover:shadow-md md:w-auto">
                        <div className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                            <Phone className="text-primary-600 h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-muted text-sm">Call Us</p>
                            <span className="font-semibold">{siteConfig.company.phone}</span>
                        </div>
                    </a>

                    {/* Email */}
                    <a href={`mailto:${siteConfig.company.email}`} className="flex w-full min-w-72 items-center gap-3 rounded-xl bg-white p-4 whitespace-nowrap transition-shadow hover:shadow-md md:w-auto">
                        <div className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                            <Mail className="text-primary-600 h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-muted text-sm">Email Us</p>
                            <span className="font-semibold">{siteConfig.company.email}</span>
                        </div>
                    </a>

                    {/* Hours */}
                    <div className="flex w-full min-w-72 items-center gap-3 rounded-xl bg-white p-4 whitespace-nowrap md:w-auto">
                        <div className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                            <Clock className="text-primary-600 h-5 w-5" aria-hidden="true" />
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
