import { Breadcrumbs, JsonLd } from "@/components/ui";
import teamData from "@/data/team.json";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { aboutPageSchema } from "@/lib/structured-data";
import AboutPageClient from "./AboutPageClient";

export const metadata = getMetadata("about");

export default function AboutPage() {
    const breadcrumbs = getBreadcrumbs("about");
    return (
        <div className="overflow-x-clip">
            <JsonLd data={aboutPageSchema()} />
            <Breadcrumbs items={breadcrumbs} />
            <AboutPageClient teamMembers={teamData.team} />
        </div>
    );
}
