import Link from "next/link";
import { ChevronRight, HelpCircle } from "lucide-react";
import { iconMap } from "@/lib/icons";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import supportNav from "@/data/support-navigation.json";

export default function SupportSectionsGrid() {
    return (
        <section aria-label="Support sections">
            <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
                {supportNav.sections.map((section) => {
                    const Icon = iconMap[section.icon] || HelpCircle;

                    return (
                        <li key={section.id} className="flex">
                            <Link href={section.path} className={`${INTERACTIVE_CARD} w-full p-7 md:p-8`}>
                                <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                <Icon className="h-7 w-7 text-primary-700" strokeWidth={1.6} aria-hidden="true" />
                                <h2 className="mt-6 text-lg font-semibold tracking-[-0.015em] text-neutral-900">{section.title}</h2>
                                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-neutral-600">{section.description}</p>
                                <span className="mt-6 inline-flex items-center gap-1 text-[15px] font-medium text-primary-700" aria-hidden="true">
                                    Learn more
                                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
