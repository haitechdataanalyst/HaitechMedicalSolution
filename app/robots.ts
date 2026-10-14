import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

// Private or transactional areas. No trailing slash: "/cart/" would block only /cart/..., not the /cart page itself.
// (The inventory pages are not listed on purpose: a blocked page cannot show its noindex, see app/inventory/layout.tsx.)
const PRIVATE_PATHS = ["/api/", "/account", "/cart", "/checkout", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/register", "/dashboard", "/admin", "/auth", "/search"];

// Prerendered at build time, like app/sitemap.ts. The sitemap URL comes from SITE_URL, so robots.txt, sitemap.xml,
// canonicals and Open Graph URLs can never name different hosts.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
