import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { iconMap } from "@/lib/icons";
import supportNav from "@/data/support-navigation.json";

export default function SupportSectionsGrid() {
    return (
        <section aria-label="Support sections" className="grid gap-5 md:grid-cols-3">
            {supportNav.sections.map((section) => {
                const Icon = iconMap[section.icon] || HelpCircle;

                return (
                    <Link
                        key={section.id}
                        href={section.path}
                        className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-7 transition-all duration-300 hover:border-primary-100 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                        <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                            <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h3 className="heading-4 mb-2 text-neutral-900 transition-colors group-hover:text-primary-600">
                            {section.title}
                        </h3>
                        <p className="flex-1 text-sm leading-relaxed text-neutral-500">{section.description}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600" aria-hidden="true">
                            Learn more
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                    </Link>
                );
            })}
        </section>
    );
}
