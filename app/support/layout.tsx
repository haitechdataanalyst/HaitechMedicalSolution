import { SupportNav } from "@/components/support";
import { Breadcrumbs } from "@/components/ui";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Support", path: "/support" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="container">
        {/* Support Header with Title */}
        <div className="pt-8 pb-4 text-center">
          <h1 className="text-foreground text-4xl font-light tracking-tight md:text-5xl">Support</h1>
        </div>

        {/* Support Navigation */}
        <SupportNav />

        {/* Page Content */}
        <main className="py-8">{children}</main>
      </div>
    </>
  );
}
