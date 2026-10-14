import { SupportNav } from "@/components/support";
import { SupportTitle } from "@/components/support/SupportTitle";
import { Breadcrumbs } from "@/components/ui";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Full-width breadcrumb bar, as on every other page (it carries its own container and padding) */}
            <Breadcrumbs items={getBreadcrumbs("supportRoot")} />

            {/* Support header: title, one line of context, then calm section navigation */}
            <div className="bg-white">
                <div className="container">
                    <div className="pt-10 pb-6 md:pt-14 md:pb-8">
                        <SupportTitle />
                        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">Find answers, get in touch, and explore our resources.</p>
                    </div>

                    <SupportNav />
                </div>
            </div>

            {/* Page Content */}
            <div className="container">
                {/* div, not main: PageTransition already renders the page's single <main> landmark */}
                <div className="pt-8 pb-20 md:pt-12 md:pb-28 [&>*:first-child]:scroll-mt-32">{children}</div>
            </div>
        </>
    );
}
