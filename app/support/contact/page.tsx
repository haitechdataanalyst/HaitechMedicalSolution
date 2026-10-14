import { ContactForm } from "@/components/forms";
import siteConfig from "@/data/site-config.json";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, SURFACE_CARD } from "@/components/ui/surfaces";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportContact");

const contactMethods = [
    {
        id: "email",
        icon: Mail,
        title: "Email Us",
        value: siteConfig.company.email,
        href: `mailto:${siteConfig.company.email}`,
        description: "Replies within 24 hours",
    },
    {
        id: "call",
        icon: Phone,
        title: "Call Us",
        value: siteConfig.company.phone,
        href: `tel:${siteConfig.company.phone.replace(/\s/g, "")}`,
        description: "Mon–Fri, 10am–6pm IST",
    },
    {
        id: "hours",
        icon: Clock,
        title: "Business Hours",
        value: "Mon–Fri, 10am–6pm",
        description: "Indian Standard Time",
    },
    {
        id: "address",
        icon: MapPin,
        title: "Visit Us",
        value: `${siteConfig.company.address.city}, ${siteConfig.company.address.country}`,
        description: siteConfig.company.address.street,
    },
];

export default function ContactPage() {
    return (
        <div className="space-y-10 md:space-y-12">
            {/* Quick-glance contact methods — the fastest paths, scannable in one row */}
            <section aria-label="Ways to reach us">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
                    {contactMethods.map((method) => {
                        const Icon = method.icon;
                        const content = (
                            <>
                                <Icon className="h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
                                <p className="mt-4 text-[13px] font-medium text-neutral-500">{method.title}</p>
                                <p className="mt-1 text-[17px] font-semibold tracking-[-0.01em] break-words text-neutral-900">{method.value}</p>
                                <p className="mt-1 text-[13px] leading-snug text-neutral-500">{method.description}</p>
                            </>
                        );
                        return (
                            <li key={method.id} className="flex">
                                {method.href ? (
                                    <a
                                        id={method.id === "email" || method.id === "call" ? method.id : undefined}
                                        href={method.href}
                                        className={`${INTERACTIVE_CARD} w-full scroll-mt-32 p-6`}
                                    >
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

            {/* Form + Location — desktop uses the width as two columns instead of stacking */}
            <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                {/* Form */}
                <div className={`${SURFACE_CARD} p-6 md:p-10`}>
                    <h2 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900 md:text-[1.75rem]">Send us a message</h2>
                    <p className="mt-2 mb-8 text-[15px] leading-relaxed text-neutral-500">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                    <ContactForm />
                </div>

                {/* Location — address, hours, and a compact embedded map in one card */}
                <div id="info" className={`${SURFACE_CARD} scroll-mt-32 p-6 md:p-8 lg:sticky lg:top-32`}>
                    <h3 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">Visit Us</h3>
                    <address className="mt-3 space-y-0.5 text-[15px] leading-relaxed text-neutral-600 not-italic">
                        <p>{siteConfig.company.address.street}</p>
                        <p>
                            {siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}
                        </p>
                        <p>{siteConfig.company.address.country}</p>
                    </address>

                    <div className="mt-5 aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sKohinoor%20Compound%2C%20Swastik%20Disa%20Corporate%20Park%2C%20Lal%20Bahadur%20Shastri%20Marg%2C%20Nityanand%20Nagar%2C%20Ghatkopar%20West%2C%20Mumbai%2C%20Maharashtra%20400086%2C%20India!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Haitech Medical office location"
                        />
                    </div>

                    <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.company.address.street + ", " + siteConfig.company.address.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 -ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[15px] font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                        Open in Maps <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                </div>
            </section>
        </div>
    );
}
