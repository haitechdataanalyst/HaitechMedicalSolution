import Link from "next/link";
import { Headset } from "lucide-react";
import { PILL_PRIMARY } from "@/components/ui/surfaces";

export default function SupportBanner() {
    return (
        <section className="bg-white">
            <div className="section-sm container">
                <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
                    <span className="bg-primary-50 text-primary-700 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                        <Headset className="h-7 w-7" aria-hidden="true" />
                    </span>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold tracking-[-0.015em] text-neutral-900 md:text-2xl">Need Help Choosing the Right Equipment?</h2>
                        <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                            Our specialist team is ready to help with product selection, technical questions, and after-sales support — personalised for your practice.
                        </p>
                    </div>

                    <Link href="/support/contact" className={`${PILL_PRIMARY} shrink-0`}>
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
