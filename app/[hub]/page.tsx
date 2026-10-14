import { notFound } from "next/navigation";
import HubPage from "@/components/hubs/HubPage";
import { getHubProductGroups } from "@/lib/catalog";
import { HUBS, hubPath } from "@/lib/hubs";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";

interface PageProps {
    params: Promise<{ hub: string }>;
}

// Only the configured hub slugs exist here; every other top-level path
// falls through to the normal 404 instead of this route.
export const dynamicParams = false;

export function generateStaticParams() {
    return HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata({ params }: PageProps) {
    const { hub: slug } = await params;
    const hub = HUBS.find((h) => h.slug === slug);
    if (!hub) return getMetadata("entityNotFound");
    // Share the first catalogue product that has a photo, the same one the page leads with.
    const image = (await getHubProductGroups(hub)).flatMap((group) => group.products).find((product) => product.defaultImage)?.defaultImage;
    return getDynamicMetadata(hub.metaTitle, hub.metaDescription, { path: hubPath(hub), image });
}

export default async function HubRoute({ params }: PageProps) {
    const { hub: slug } = await params;
    if (!HUBS.some((h) => h.slug === slug)) notFound();
    return <HubPage slug={slug} />;
}
