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
        description: "We respond within 24 hours",
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
        <div className="mx-auto max-w-6xl space-y-10 scroll-mt-32">

            {/* Contact Methods */}
            <section className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-neutral-200 pt-5 md:grid-cols-4">
                {contactMethods.map((method) => {
                    const Icon = method.icon;
                    const content = (
                        <div className="flex items-start gap-2.5">
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{method.title}</p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900">{method.value}</p>
                                <p className="mt-0.5 text-xs text-neutral-400">{method.description}</p>
                            </div>
                        </div>
                    );
                    return method.href ? (
                        <a key={method.id} href={method.href} className="transition-opacity hover:opacity-70">{content}</a>
                    ) : (
                        <div key={method.id}>{content}</div>
                    );
                })}
            </section>

            {/* Map & Location */}
            <section>
                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
                    <div className="grid md:grid-cols-2">
                        <div className="p-7 flex flex-col justify-center">
                            <h3 className="heading-4 mb-4 text-neutral-900">Our Location</h3>
                            <address className="space-y-1.5 not-italic text-sm text-neutral-500">
                                <p>{siteConfig.company.address.street}</p>
                                <p>
                                    {siteConfig.company.address.city}, {siteConfig.company.address.state}{" "}
                                    {siteConfig.company.address.postcode}
                                </p>
                                <p>{siteConfig.company.address.country}</p>
                            </address>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.company.address.street + ", " + siteConfig.company.address.city)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                Open in Maps <ArrowRight size={14} />
                            </a>
                        </div>
                        <div className="aspect-video md:aspect-auto">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sKohinoor%20Compound%2C%20Swastik%20Disa%20Corporate%20Park%2C%20Lal%20Bahadur%20Shastri%20Marg%2C%20Nityanand%20Nagar%2C%20Ghatkopar%20West%2C%20Mumbai%2C%20Maharashtra%20400086%2C%20India!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: "240px" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Haitech Medical office location"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form + Sidebar */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Form */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl border border-neutral-100 bg-white p-7 md:p-8">
                        <h2 className="heading-3 mb-1.5 text-neutral-900">Send us a message</h2>
                        <p className="mb-7 text-sm text-neutral-500">
                            Fill out the form below and we&apos;ll get back to you as soon as possible.
                        </p>
                        <ContactForm />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Quick call CTA */}
                    <div className="rounded-2xl bg-primary-50 border border-primary-100 p-6">
                        <h3 className="mb-2 font-semibold text-neutral-900">Need Immediate Help?</h3>
                        <p className="mb-4 text-sm text-neutral-500">
                            For urgent queries, call us directly during business hours.
                        </p>
                        <a
                            href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600"
                        >
                            <Phone className="h-4 w-4" />
                            Call Now
                        </a>
                    </div>

                    {/* Address */}
                    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
                        <h3 className="mb-3 font-semibold text-neutral-900">Our Address</h3>
                        <address className="space-y-1 text-sm text-neutral-500 not-italic">
                            <p>{siteConfig.company.address.street}</p>
                            <p>{siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}</p>
                            <p>{siteConfig.company.address.country}</p>
                        </address>
                    </div>

                    {/* Response times */}
                    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
                        <h3 className="mb-4 font-semibold text-neutral-900">Response Times</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-neutral-600">Email — within 24 hours</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <span className="h-2 w-2 rounded-full bg-primary-500" />
                                <span className="text-neutral-600">Phone — immediate (business hours)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
