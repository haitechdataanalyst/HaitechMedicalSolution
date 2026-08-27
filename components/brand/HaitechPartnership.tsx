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
        <section className="border-t border-neutral-200 bg-white py-16 md:py-20 lg:py-24">
            <div className="container">
                <ScrollReveal variant="up">
                    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                        <Image src="/haitech-medical.png" alt="Haitech Medical" width={44} height={44} />
                        <div>
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Authorized Distribution Partner
                            </span>
                            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl lg:text-4xl">
                                Backed by Haitech Medical Solutions
                            </h2>
                        </div>
                        <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
                            Haitech Medical Solutions brings {brand} to dental professionals across India — with local stock, service, warranty support, and a team that knows the equipment inside out.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                            {TRUST_POINTS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                                    <Icon className="h-4 w-4 shrink-0 text-primary-600" />
                                    {label}
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/about"
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
                        >
                            Learn more about Haitech
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
