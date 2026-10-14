import Link from "next/link";
import { FooterSection, SiteConfig } from "@/types";
import { PhoneIcon, EmailIcon, LocationIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";
import Image from "next/image";
import { NewsletterSignup } from "./NewsletterSignup";
import { ChevronDown } from "lucide-react";

interface FooterProps {
    sections: FooterSection[];
    config: SiteConfig;
}

const TRUST_POINTS = ["ISO Certified Distributor", "15+ Years of Excellence", "24-Hour Response Guarantee"];

const LINK = "text-neutral-600 transition-colors duration-200 hover:text-neutral-900";
const SOCIAL = "flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-900/[0.05] hover:text-neutral-900";

function SectionLinks({ section }: { section: FooterSection }) {
    return (
        <ul className="space-y-0 md:space-y-2.5">
            {section.links.map((link) => (
                <li key={link.href}>
                    <Link href={link.href} className={`${LINK} flex min-h-11 items-center text-[15px] md:inline md:min-h-0 md:text-sm`}>
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function Footer({ sections, config }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const { address } = config.company;
    const mapsQuery = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.postcode}`);

    return (
        <footer className="bg-neutral-50 text-neutral-600">
            <div className="container pt-14 pb-8 md:pt-16">
                {/* Brand + newsletter */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-md">
                        <Link href="/" className="inline-flex items-center gap-3 rounded-lg">
                            <Image src="/haitech-medical.png" alt="" width={36} height={36} className="shrink-0" />
                            <span>
                                <span className="block text-base leading-tight font-semibold tracking-[-0.01em] text-neutral-900">Haitech</span>
                                <span className="block text-[13px] text-neutral-500">Medical Solutions Pvt. Ltd.</span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                            Premium medical and dental equipment for dental and medical professionals across India — proudly distributed from Mumbai since 2013, with a growing international footprint.
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">Get product updates &amp; clinical tips</p>
                        <p className="mt-1 text-[13px] text-neutral-500">No spam. Unsubscribe anytime.</p>
                        <div className="mt-4">
                            <NewsletterSignup />
                        </div>
                    </div>
                </div>

                {/* Link columns */}
                <div className="mt-12 border-t border-neutral-900/[0.08] pt-10 md:mt-14">
                    {/* Mobile: native accordions — 44px rows, work without JavaScript */}
                    <div className="divide-y divide-neutral-900/[0.08] md:hidden">
                        {sections.map((section) => (
                            <details key={section.title} className="group">
                                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                                    {section.title}
                                    <ChevronDown className="h-4 w-4 text-neutral-500 transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
                                </summary>
                                <div className="pb-3">
                                    <SectionLinks section={section} />
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* md+: open columns */}
                    <div className="hidden gap-8 md:grid md:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.35fr)]">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-4 text-[13px] font-semibold text-neutral-900">{section.title}</h3>
                                <SectionLinks section={section} />
                            </div>
                        ))}

                        <div>
                            <h3 className="mb-4 text-[13px] font-semibold text-neutral-900">Contact</h3>
                            <ContactList config={config} mapsQuery={mapsQuery} />
                        </div>
                    </div>

                    {/* Mobile contact */}
                    <div className="mt-8 md:hidden">
                        <h3 className="mb-2 text-[15px] font-semibold text-neutral-900">Contact</h3>
                        <ContactList config={config} mapsQuery={mapsQuery} />
                    </div>
                </div>

                {/* Trust points */}
                <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-neutral-500">
                    {TRUST_POINTS.map((point) => (
                        <li key={point}>{point}</li>
                    ))}
                </ul>

                {/* Bottom bar */}
                <div className="mt-6 flex flex-col gap-4 border-t border-neutral-900/[0.08] pt-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 text-[13px] text-neutral-500 sm:flex-row sm:items-center sm:gap-6">
                        <p>
                            © {currentYear} {config.company.name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-5">
                            <Link href="/support/policies/privacy" className={`${LINK} inline-flex min-h-11 items-center sm:min-h-0`}>
                                Privacy Policy
                            </Link>
                            <Link href="/support/policies/terms" className={`${LINK} inline-flex min-h-11 items-center sm:min-h-0`}>
                                Terms of Service
                            </Link>
                        </div>
                    </div>

                    <div className="-ml-3 flex items-center md:ml-0">
                        <a href={config.social?.facebook} target="_blank" rel="noopener noreferrer" className={SOCIAL} aria-label="Facebook">
                            <FacebookIcon size={18} />
                        </a>
                        <a href={config.social?.instagram} target="_blank" rel="noopener noreferrer" className={SOCIAL} aria-label="Instagram">
                            <InstagramIcon size={18} />
                        </a>
                        {config.social?.linkedin && (
                            <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className={SOCIAL} aria-label="LinkedIn">
                                <LinkedInIcon size={18} />
                            </a>
                        )}
                        <a href={`mailto:${config.company.email}`} className={SOCIAL} aria-label="Email">
                            <EmailIcon size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function ContactList({ config, mapsQuery }: { config: SiteConfig; mapsQuery: string }) {
    const { address } = config.company;
    const row = `${LINK} flex min-h-11 gap-2.5 text-[15px] md:min-h-0 md:text-sm`;
    return (
        <div className="space-y-0 md:space-y-3">
            <a href={`tel:${config.company.phone}`} className={`${row} items-center`}>
                <PhoneIcon size={14} className="shrink-0 text-neutral-500" aria-hidden="true" />
                {config.company.phone}
            </a>
            <a href={`mailto:${config.company.email}`} className={`${row} items-center`}>
                <EmailIcon size={14} className="shrink-0 text-neutral-500" aria-hidden="true" />
                <span className="break-all">{config.company.email}</span>
            </a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer" className={`${row} items-start py-2.5 md:py-0`}>
                <LocationIcon size={14} className="mt-[3px] shrink-0 text-neutral-500" aria-hidden="true" />
                <span>
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.postcode}
                </span>
            </a>
        </div>
    );
}
