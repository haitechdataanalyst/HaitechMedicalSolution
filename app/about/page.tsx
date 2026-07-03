import { Breadcrumbs } from "@/components/ui";
import teamData from "@/data/team.json";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import AboutPageClient from "./AboutPageClient";

export const metadata = getMetadata("about");

export default function AboutPage() {
    const breadcrumbs = getBreadcrumbs("about");
    return (
        <div className="overflow-x-hidden">
            <Breadcrumbs items={breadcrumbs} />
            <AboutPageClient teamMembers={teamData.team} />
        </div>
    );
}
