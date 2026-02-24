import { Breadcrumb } from "@/types";

const staticBreadcrumbMap = {
    about: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
    ],
    products: [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
    ],
    ourFrames: [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Our Frames", path: "/our-frames" },
    ],
    ourHeadlights: [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Headlights", path: "/our-headlights" },
    ],
    ourInstruments: [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Medesy Instruments", path: "/our-instruments" },
    ],
    supportRoot: [
        { name: "Home", path: "/" },
        { name: "Support", path: "/support" },
    ],
} as const;

export type BreadcrumbKey = keyof typeof staticBreadcrumbMap;

export function getBreadcrumbs(key: BreadcrumbKey): Breadcrumb[] {
    return staticBreadcrumbMap[key].map((item) => ({ ...item }));
}

export function getMedesyProductBreadcrumbs(productName: string, productSlug: string): Breadcrumb[] {
    return [...getBreadcrumbs("ourInstruments"), { name: productName, path: `/our-instruments/${productSlug}` }];
}

export function getArticleBreadcrumbs(articleTitle: string, articleSlug: string): Breadcrumb[] {
    return [...getBreadcrumbs("supportRoot"), { name: "Articles", path: "/support/articles" }, { name: articleTitle, path: `/support/articles/${articleSlug}` }];
}
