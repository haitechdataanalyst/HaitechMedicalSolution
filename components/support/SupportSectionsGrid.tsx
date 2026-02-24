import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { iconMap } from "@/lib/icons";
import supportNav from "@/data/support-navigation.json";

export default function SupportSectionsGrid() {
    return (
        <section aria-label="Support sections" className="grid gap-6 md:grid-cols-3">
            {supportNav.sections.map((section) => {
                const Icon = iconMap[section.icon] || HelpCircle;

                return (
                    <Link
                        key={section.id}
                        href={section.path}
                        className="group card focus-visible:ring-primary-600 flex flex-col p-6 transition-all duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${section.color}`}>
                            <Icon className="h-7 w-7" aria-hidden="true" />
                        </div>
                        <h3 className="heading-4 group-hover:text-primary-600 mb-2 transition-colors">{section.title}</h3>
                        <p className="text-muted flex-1 text-sm">{section.description}</p>
                        <span className="text-primary-600 mt-4 inline-flex items-center text-sm font-medium" aria-hidden="true">
                            Learn more
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                );
            })}
        </section>
    );
}
