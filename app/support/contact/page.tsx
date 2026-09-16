import { ContactForm } from "@/components/forms";
import siteConfig from "@/data/site-config.json";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
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
        <div className="mx-auto max-w-6xl space-y-6">
            {/* Quick-glance contact methods — the fastest paths, scannable in one row */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {contactMethods.map((method) => {
                    const Icon = method.icon;
                    const content = (
                        <div className="flex h-full flex-col gap-2">
                            <Icon className="h-4 w-4 shrink-0 text-primary-600" />
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{method.title}</p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900">{method.value}</p>
                                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-400">{method.description}</p>
                            </div>
                        </div>
                    );
                    return method.href ? (
                        <a
                            key={method.id}
                            id={method.id === "email" || method.id === "call" ? method.id : undefined}
                            href={method.href}
                            className="card card-hover scroll-mt-32 p-4"
                        >
                            {content}
                        </a>
                    ) : (
                        <div key={method.id} className="card p-4">
                            {content}
                        </div>
                    );
                })}
            </section>

            {/* Form + Location — desktop uses the width as two columns instead of stacking */}
            <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                {/* Form */}
                <div className="card p-6 md:p-8">
                    <h2 className="heading-3 mb-1.5 text-neutral-900">Send us a message</h2>
                    <p className="mb-6 text-sm text-neutral-500">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                    <ContactForm />
                </div>

                {/* Location — address, hours, and a compact embedded map in one card */}
                <div id="info" className="card scroll-mt-32 p-6">
                    <h3 className="mb-3 font-semibold text-neutral-900">Visit Us</h3>
                    <address className="space-y-1 text-sm text-neutral-500 not-italic">
                        <p>{siteConfig.company.address.street}</p>
                        <p>
                            {siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}
                        </p>
                        <p>{siteConfig.company.address.country}</p>
                    </address>

                    <div className="mt-4 h-40 overflow-hidden rounded-xl border border-neutral-100">
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
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Open in Maps <ArrowRight size={14} />
                    </a>
                </div>
            </section>
        </div>
    );
}
