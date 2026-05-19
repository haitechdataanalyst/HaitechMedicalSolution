import Link from "next/link";
import { Button } from "@/components/ui";
import { Lordicon } from "../icons";
import { ArrowRight } from "lucide-react";

export default function SupportBanner() {
    return (
        <section className="border-t border-neutral-100 bg-white">
            <div className="section container">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
                    {/* Icon */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-50">
                        <Lordicon
                            icon="phone"
                            size={48}
                            trigger="loop"
                            colors={{ primary: "#1fb6cd", secondary: "#115970" }}
                        />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                        <h2 className="heading-3 text-neutral-900 mb-2">Need Help Choosing the Right Equipment?</h2>
                        <p className="text-sm leading-relaxed text-neutral-500">
                            Our specialist team is ready to help with product selection, technical questions, and after-sales support — personalised for your practice.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="shrink-0">
                        <Link href="/support/contact">
                            <Button
                                size="lg"
                                variant="primary"
                                className="group gap-2.5 rounded-full px-8 font-semibold shadow-sm hover:shadow-brand"
                            >
                                Contact Us
                                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
