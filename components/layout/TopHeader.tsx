"use client";

import siteConfig from "@/data/site-config.json";
import { PhoneOutgoing, Mail, Truck } from "lucide-react";

export default function TopHeader() {
    return (
        <div className="border-b border-white/5 bg-navy-900">
            <div className="container">
                <div className="flex h-8 items-center justify-between gap-4 overflow-hidden">
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-navy-300">
                        <Truck size={11} className="shrink-0 text-primary-400" />
                        <span className="truncate whitespace-nowrap">
                            Free delivery on all orders ·{" "}
                            <span className="font-semibold text-white">
                                Authorized distributor of Admetec, Medesy, Salli &amp; more
                            </span>
                        </span>
                    </div>
                    <div className="hidden items-center gap-5 sm:flex">
                        <a
                            href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-1.5 text-[11px] text-navy-300 transition-colors hover:text-white"
                        >
                            <PhoneOutgoing size={11} />
                            <span>{siteConfig.company.phone}</span>
                        </a>
                        <a
                            href={`mailto:${siteConfig.company.email}`}
                            className="hidden items-center gap-1.5 text-[11px] text-navy-300 transition-colors hover:text-white md:flex"
                        >
                            <Mail size={11} />
                            <span>{siteConfig.company.email}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
