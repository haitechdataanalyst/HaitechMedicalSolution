import type { ReactNode } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { getCategoryContents, resolvePathToEntity } from "@/lib/catalog";
import type { Category } from "@/types";

// The page streams behind loading.tsx, and a streamed response has already sent its 200 status by the time the page itself
// can call notFound() or redirect(): an unknown URL came back as a "200 not found" (a soft 404) and a redirect only
// happened in the browser. A layout runs before that boundary, so both can be real HTTP responses from here.
export default async function CategoryRouteLayout({ children, params }: { children: ReactNode; params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const result = await resolvePathToEntity(path);
    if (!result) notFound();

    // Frames and lights are listed on their own pages (category.specialPage), not under their category. A category with
    // no products of its own would only be an empty "Products Coming Soon" page, so send it to the real page.
    if (result.type === "category") {
        const category = result.entity as Category;
        if (category.specialPage && (await getCategoryContents(category.id)).items.length === 0) permanentRedirect(category.specialPage);
    }
    return children;
}
