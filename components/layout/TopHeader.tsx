"use client";

import Link from "next/link";
import siteConfig from "@/data/site-config.json";
import navigation from "@/data/navigation.json";
import { PhoneOutgoing, Send } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-primary-900 border-primary-100 border-b">
      <div className="container">
        <div className="flex items-center justify-between py-2.5 text-sm">
          {/* Quick Links - Left */}
          <nav className="flex items-center gap-4 md:gap-6">
            {navigation["top-header"] &&
              navigation["top-header"].map((link) => (
                <Link key={link.href} href={link.href} className="text-primary-100 font-medium transition-colors duration-200 hover:text-white">
                  {link.label}
                </Link>
              ))}
          </nav>

          {/* Contact Info - Right */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Phone */}
            <a href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`} className="text-primary-100 flex items-center gap-2 transition-colors duration-200 hover:text-white" title="Call us">
              <PhoneOutgoing size={16} />
              <span className="hidden font-medium sm:inline">{siteConfig.company.phone}</span>
            </a>

            {/* Email */}
            <a href={`mailto:${siteConfig.company.email}`} className="text-primary-100 flex items-center gap-2 transition-colors duration-200 hover:text-white" title="Email us">
              <Send strokeWidth={3} size={16} />
              <span className="hidden font-medium sm:inline">{siteConfig.company.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
