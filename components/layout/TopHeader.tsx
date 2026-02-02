"use client";

import Link from "next/link";
import { PhoneIcon, EmailIcon } from "@/components/icons";
import siteConfig from "@/data/site-config.json";

export default function TopHeader() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/support/contact" },
    { label: "FAQ", href: "/support/faq" },
  ];

  return (
    <div className="bg-primary-900 border-primary-100 border-b">
      <div className="container">
        <div className="flex items-center justify-between py-2.5 text-sm">
          {/* Quick Links - Left */}
          <nav className="flex items-center gap-4 md:gap-6">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-primary-100 font-medium transition-colors duration-200 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info - Right */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Phone */}
            <a href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`} className="text-primary-100 flex items-center gap-2 transition-colors duration-200 hover:text-white" title="Call us">
              <PhoneIcon size={16} />
              <span className="hidden font-medium sm:inline">{siteConfig.company.phone}</span>
            </a>

            {/* Email */}
            <a href={`mailto:${siteConfig.company.email}`} className="text-primary-100 flex items-center gap-2 transition-colors duration-200 hover:text-white" title="Email us">
              <EmailIcon size={16} />
              <span className="hidden font-medium sm:inline">{siteConfig.company.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
