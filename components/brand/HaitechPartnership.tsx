import { linkAdmetec } from "@/components/brand/AdmetecText";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Star, Clock, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const TRUST_POINTS = [
    { icon: ShieldCheck, label: "ISO Certified Distributor" },
    { icon: Star, label: "15+ Years of Excellence" },
    { icon: Clock, label: "24-Hour Response Guarantee" },
];

/** Shared "Haitech backs this brand" section — kept visually identical
 * across every brand About page by design, so it reads as one constant
 * regardless of which brand's page it appears on. */
export function HaitechPartnership({ brand }: { brand: string }) {
    return (
        <section className="bg-white">
            <div className="section container">
                <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                    <Image src="/haitech-medical.png" alt="Haitech Medical" width={44} height={44} />
                    <p className="text-primary-700 mt-6 text-[15px] font-medium">Authorized distribution partner</p>
                    <ScrollReveal variant="fade">
                        <h2 className="mt-2 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 text-balance md:text-[2.5rem]">Backed by Haitech Medical Solutions</h2>
                    </ScrollReveal>
                    <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                        Haitech Medical Solutions brings {linkAdmetec(brand)} to dental professionals across India — with local stock, service, warranty support, and a team that knows the equipment inside out.
                    </p>
                    <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                        {TRUST_POINTS.map(({ icon: Icon, label }) => (
                            <li key={label} className="flex items-center gap-2 text-[15px] text-neutral-700">
                                <Icon className="text-primary-700 h-4 w-4 shrink-0" aria-hidden="true" />
                                {label}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/about"
                        className="group text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Learn more about Haitech
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
