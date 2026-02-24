import Link from "next/link";
import { FooterSection, SiteConfig } from "@/types";
import { PhoneIcon, EmailIcon, LocationIcon, FacebookIcon, InstagramIcon } from "@/components/icons";
import Image from "next/image";

interface FooterProps {
    sections: FooterSection[];
    config: SiteConfig;
}

export default function Footer({ sections, config }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-neutral-300">
            <div className="section container">
                <div className="flex flex-col items-start justify-between gap-6 border-b border-neutral-800 pb-8 md:flex-row md:items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image width={200} height={40} src="/haitech_medical_logo.png" alt="Haitech Medical Logo" />
                    </Link>

                    <div className="flex-1" />

                    {/* Privacy + Social Media Icons */}
                    <div className="flex items-center gap-4">
                        <Link href="/support/policies/privacy" className="text-sm text-neutral-400 transition-colors hover:text-white">
                            Privacy Policy
                        </Link>
                        <div className="flex items-center gap-2">
                            <a
                                href={config.social?.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all duration-300 hover:text-white"
                                aria-label="Facebook"
                            >
                                <FacebookIcon size={20} />
                            </a>
                            <a
                                href={config.social?.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all duration-300 hover:text-white"
                                aria-label="Instagram"
                            >
                                <InstagramIcon size={20} />
                            </a>
                            <a
                                href={`mailto:${config.company.email}`}
                                className="hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all duration-300 hover:text-white"
                                aria-label="Email Us"
                            >
                                <EmailIcon size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Company Info */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <p className="mb-4 text-sm text-neutral-400">Premium medical and dental equipment for healthcare professionals.</p>
                        <div className="space-y-2.5 text-sm">
                            <p className="flex items-center gap-2">
                                <PhoneIcon size={16} />
                                {config.company.phone}
                            </p>
                            <p className="flex items-center gap-2">
                                <EmailIcon size={16} className="shrink-0" />
                                <span className="break-all">{config.company.email}</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <LocationIcon size={16} className="mt-0.5 shrink-0" />
                                <span>
                                    {config.company.address.street}
                                    <br />
                                    {config.company.address.city}, {config.company.address.state} {config.company.address.postcode}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h3 className="mb-4 font-semibold text-white">{section.title}</h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-neutral-800 pt-8 pb-8">
                    <div className="text-center-mobile flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-neutral-500">
                            © {currentYear} {config.company.name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link href="/privacy" className="text-sm text-neutral-500 transition-colors hover:text-white">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-neutral-500 transition-colors hover:text-white">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
