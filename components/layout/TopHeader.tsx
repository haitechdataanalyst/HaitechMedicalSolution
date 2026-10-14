"use client";

import siteConfig from "@/data/site-config.json";

const LINK = "rounded transition-colors duration-200 hover:text-white";

export default function TopHeader() {
    return (
        <div className="bg-navy-900 text-[12px] text-white/75 sm:text-[13px]">
            <div className="container">
                <div className="flex h-8 items-center justify-center gap-6 overflow-hidden sm:justify-between">
                    <p className="min-w-0 truncate">
                        Free delivery on all orders
                        <span className="hidden md:inline">
                            {" · "}
                            <span className="text-white">Authorized distributor of Admetec, Medesy, Salli &amp; more</span>
                        </span>
                    </p>
                    <div className="hidden shrink-0 items-center gap-5 sm:flex">
                        <a href={`tel:${siteConfig.company.phone.replace(/\s/g, "")}`} className={LINK}>
                            {siteConfig.company.phone}
                        </a>
                        <a href={`mailto:${siteConfig.company.email}`} className={`${LINK} hidden lg:inline`}>
                            {siteConfig.company.email}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
