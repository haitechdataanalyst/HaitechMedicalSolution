"use client";

import Link from "next/link";
import { PhoneIcon, EmailIcon } from "@/components/icons";
import siteConfig from "@/data/site-config.json";

export default function TopHeader() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <div className="bg-primary-900 border-b border-primary-100">
      <div className="container">
        <div className="flex items-center justify-between py-2.5 text-sm">
          {/* Quick Links - Left */}
          <nav className="flex items-center gap-4 md:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary-100 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info - Right */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Phone */}
            <a
              href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors duration-200"
              title="Call us"
            >
              <PhoneIcon size={16} />
              <span className="hidden sm:inline font-medium">
                {siteConfig.company.phone}
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.company.email}`}
              className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors duration-200"
              title="Email us"
            >
              <EmailIcon size={16} />
              <span className="hidden sm:inline font-medium">
                {siteConfig.company.email}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
