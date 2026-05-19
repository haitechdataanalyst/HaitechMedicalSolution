import { SupportNav } from "@/components/support";
import { Breadcrumbs } from "@/components/ui";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Hero-style support header */}
            <div className="border-b border-neutral-100 bg-white">
                <div className="container">
                    <div className="pt-6 pb-2">
                        <Breadcrumbs items={getBreadcrumbs("supportRoot")} />
                    </div>
                    <div className="pb-8 pt-4">
                        <span className="label-tag label-tag-primary mb-4 inline-flex">Help Centre</span>
                        <h1 className="heading-1 text-neutral-900">Support</h1>
                        <p className="mt-3 text-base text-neutral-500 max-w-xl">
                            Find answers, get in touch, and explore our resources.
                        </p>
                    </div>

                    {/* Support Navigation */}
                    <SupportNav />
                </div>
            </div>

            {/* Page Content */}
            <div className="container">
                <main className="py-10 md:py-14 [&>*:first-child]:scroll-mt-32">{children}</main>
            </div>
        </>
    );
}
