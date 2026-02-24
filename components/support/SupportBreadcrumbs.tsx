"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/ui";
import supportNav from "@/data/support-navigation.json";
import type { Breadcrumb } from "@/types";

const baseBreadcrumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: "Support", path: "/support" },
];

function buildBreadcrumbs(pathname: string): Breadcrumb[] {
    // Root support page
    if (pathname === "/support") {
        return baseBreadcrumbs;
    }

    const crumbs: Breadcrumb[] = [...baseBreadcrumbs];

    // Match against support-navigation sections
    for (const section of supportNav.sections) {
        if (pathname === section.path || pathname.startsWith(section.path + "/")) {
            crumbs.push({ name: section.title, path: section.path });

            // Check children
            for (const child of section.children) {
                const childBasePath = child.path.split("#")[0]; // Strip hash fragments
                if (pathname === childBasePath || pathname.startsWith(childBasePath + "/")) {
                    crumbs.push({ name: child.title, path: childBasePath });
                    break;
                }
            }

            // Handle deeper nested paths (e.g., /support/policies/privacy, /support/articles/[slug])
            const remainingPath = pathname.replace(section.path, "");
            const segments = remainingPath.split("/").filter(Boolean);

            if (segments.length > 0 && crumbs.length === 2 + 1) {
                // If no child matched but there are deeper segments, generate from path
                const segmentName = segments[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                crumbs.push({ name: segmentName, path: `${section.path}/${segments[0]}` });
            }

            if (segments.length > 1) {
                const deepName = segments[segments.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                crumbs.push({ name: deepName, path: pathname });
            }

            break;
        }
    }

    return crumbs;
}

export function SupportBreadcrumbs() {
    const pathname = usePathname();
    const items = buildBreadcrumbs(pathname);

    return <Breadcrumbs items={items} />;
}
