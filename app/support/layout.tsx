import { SupportNav } from "@/components/support";
import { Breadcrumbs } from "@/components/ui";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Breadcrumbs items={getBreadcrumbs("supportRoot")} />

            <div className="container">
                {/* Support Header with Title */}
                <div className="pt-8 pb-4 text-center">
                    <h1 className="text-foreground text-4xl font-light tracking-tight md:text-5xl">Support</h1>
                </div>

                {/* Support Navigation - hidden on /support root */}
                <SupportNav />

                {/* Page Content */}
                <main className="py-8">{children}</main>
            </div>
        </>
    );
}
