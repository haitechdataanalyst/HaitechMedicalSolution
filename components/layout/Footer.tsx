import Link from "next/link";
import { FooterSection, SiteConfig } from "@/types";
import { PhoneIcon, EmailIcon, LocationIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";
import Image from "next/image";
import { NewsletterSignup } from "./NewsletterSignup";
import { ShieldCheck, Star, Clock } from "lucide-react";

interface FooterProps {
    sections: FooterSection[];
    config: SiteConfig;
}

export default function Footer({ sections, config }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy-900 text-navy-300">
            {/* Newsletter + Trust Badges strip */}
            <div className="border-b border-white/8">
                <div className="container">
                    <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
                        {/* Newsletter */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold text-white">Get product updates &amp; clinical tips</p>
                            <p className="text-xs text-navy-400">No spam. Unsubscribe anytime.</p>
                        </div>
                        <NewsletterSignup />
                    </div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="border-b border-white/8">
                <div className="container">
                    <div className="flex flex-wrap items-center justify-center gap-6 py-4 sm:gap-10">
                        <div className="flex items-center gap-2 text-navy-400">
                            <ShieldCheck className="h-4 w-4 text-primary-400 shrink-0" />
                            <span className="text-xs font-medium">ISO Certified Distributor</span>
                        </div>
                        <div className="flex items-center gap-2 text-navy-400">
                            <Star className="h-4 w-4 text-primary-400 shrink-0" />
                            <span className="text-xs font-medium">15+ Years of Excellence</span>
                        </div>
                        <div className="flex items-center gap-2 text-navy-400">
                            <Clock className="h-4 w-4 text-primary-400 shrink-0" />
                            <span className="text-xs font-medium">24-Hour Response Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer body */}
            <div className="section container">
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-12 lg:gap-8">
                    {/* Brand column */}
                    <div className="col-span-2 lg:col-span-4">
                        <Link href="/" className="mb-5 inline-flex items-center gap-3">
                            <Image
                                src="/haitech-medical.png"
                                alt="Haitech"
                                width={38}
                                height={38}
                                className="shrink-0"
                            />
                            <div>
                                <p className="text-base font-bold leading-none text-white">Haitech</p>
                                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-teal">Medical Solutions Pvt. Ltd.</p>
                            </div>
                        </Link>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-navy-300">
                            Premium medical and dental equipment for dental and medical professionals across India — proudly distributed from Mumbai since 2013, with a growing international footprint.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-3 text-sm">
                            <a
                                href={`tel:${config.company.phone}`}
                                className="flex items-center gap-2.5 text-navy-400 transition-colors hover:text-white"
                            >
                                <PhoneIcon size={14} className="shrink-0 text-primary-400" />
                                {config.company.phone}
                            </a>
                            <a
                                href={`mailto:${config.company.email}`}
                                className="flex items-center gap-2.5 text-navy-400 transition-colors hover:text-white"
                            >
                                <EmailIcon size={14} className="shrink-0 text-primary-400" />
                                <span className="break-all">{config.company.email}</span>
                            </a>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${config.company.address.street}, ${config.company.address.city}, ${config.company.address.state} ${config.company.address.postcode}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2.5 text-navy-400 transition-colors hover:text-white"
                            >
                                <LocationIcon size={14} className="mt-0.5 shrink-0 text-primary-400" />
                                <span>
                                    {config.company.address.street}<br />
                                    {config.company.address.city}, {config.company.address.state} {config.company.address.postcode}
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:col-span-1 lg:block" />

                    {/* Footer sections */}
                    {sections.map((section) => (
                        <div key={section.title} className="lg:col-span-2">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-navy-400 transition-colors duration-200 hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="container">
                <div className="h-px bg-white/8" />
            </div>

            {/* Bottom bar */}
            <div className="container">
                <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
                    <p className="text-xs text-navy-400">
                        © {currentYear} {config.company.name}. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/support/policies/privacy" className="text-xs text-navy-400 transition-colors hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="/support/policies/terms" className="text-xs text-navy-400 transition-colors hover:text-white">
                            Terms of Service
                        </Link>
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-2">
                        <a
                            href={config.social?.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-navy-400 transition-all duration-200 hover:bg-primary-500 hover:text-white sm:h-8 sm:w-8"
                            aria-label="Facebook"
                        >
                            <FacebookIcon size={16} />
                        </a>
                        <a
                            href={config.social?.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-navy-400 transition-all duration-200 hover:bg-primary-500 hover:text-white sm:h-8 sm:w-8"
                            aria-label="Instagram"
                        >
                            <InstagramIcon size={16} />
                        </a>
                        {config.social?.linkedin && (
                            <a
                                href={config.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-navy-400 transition-all duration-200 hover:bg-primary-500 hover:text-white sm:h-8 sm:w-8"
                                aria-label="LinkedIn"
                            >
                                <LinkedInIcon size={16} />
                            </a>
                        )}
                        <a
                            href={`mailto:${config.company.email}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-navy-400 transition-all duration-200 hover:bg-primary-500 hover:text-white sm:h-8 sm:w-8"
                            aria-label="Email"
                        >
                            <EmailIcon size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
