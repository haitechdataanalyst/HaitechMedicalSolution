import { ContactForm } from "@/components/forms";
import siteConfig from "@/data/site-config.json";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
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
        description: "Mon-Fri 10am-6pm IST",
    },
    {
        id: "info",
        icon: Clock,
        title: "Business Hours",
        value: "Mon - Fri: 10:00 AM - 6:00 PM",
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
        <div className="mx-auto max-w-6xl">
            {/* Contact Methods Grid */}
            <section id="email" className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                        <div key={method.id} id={method.id} className="hover:border-primary-300 rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:shadow-md">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50">
                                <Icon className="text-primary-600 h-5 w-5" aria-hidden="true" />
                            </div>
                            <h3 className="mb-1 text-sm font-semibold">{method.title}</h3>
                            {method.href ? (
                                <a href={method.href} className="text-primary-600 block truncate text-sm font-medium hover:underline">
                                    {method.value}
                                </a>
                            ) : (
                                <p className="truncate text-sm font-medium">{method.value}</p>
                            )}
                            <p className="text-muted mt-1 text-xs">{method.description}</p>
                        </div>
                    );
                })}
            </section>

            {/* Map and Location Section */}
            <section id="location" className="mb-12">
                <div className="flex overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <div className="flex-1 p-6">
                        <h3 className="mb-3 font-semibold">Our Location</h3>
                        <address className="text-muted space-y-1 not-italic">
                            <p>{siteConfig.company.address.street}</p>
                            <p>
                                {siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}
                            </p>
                            <p>{siteConfig.company.address.country}</p>
                        </address>
                    </div>
                    <div className="aspect-4/3 flex-1">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sKohinoor%20Compound%2C%20Swastik%20Disa%20Corporate%20Park%2C%20Lal%20Bahadur%20Shastri%20Marg%2C%20Nityanand%20Nagar%2C%20Ghatkopar%20West%2C%20Mumbai%2C%20Maharashtra%20400086%2C%20India!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Haitech Medical office location on Google Maps"
                        />
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Form */}
                <div className="lg:col-span-3">
                    <div className="card p-6 md:p-8">
                        <h2 className="heading-3 mb-2">Send us a message</h2>
                        <p className="text-muted mb-6">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                        <ContactForm />
                    </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Quick Support */}
                    <div className="bg-primary-50 rounded-xl p-6">
                        <h3 className="mb-3 font-semibold">Need Quick Support?</h3>
                        <p className="text-muted mb-4 text-sm">For urgent inquiries, call us directly during business hours for immediate assistance.</p>
                        <a
                            href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`}
                            className="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            Call Now
                        </a>
                    </div>

                    {/* Address Card */}
                    <div className="bg-surface-secondary rounded-xl p-6">
                        <h3 className="mb-3 font-semibold">Our Location</h3>
                        <address className="text-muted space-y-1 text-sm not-italic">
                            <p>{siteConfig.company.address.street}</p>
                            <p>
                                {siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}
                            </p>
                            <p>{siteConfig.company.address.country}</p>
                        </address>
                    </div>

                    {/* Response Time */}
                    <div className="rounded-xl border border-neutral-200 p-6">
                        <h3 className="mb-3 font-semibold">Response Times</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-muted">Email: Within 24 hours</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                <span className="text-muted">Phone: Immediate (business hours)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
