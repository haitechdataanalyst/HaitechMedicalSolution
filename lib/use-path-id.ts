"use client";

import { useSyncExternalStore } from "react";

const subscribeNever = () => () => undefined;

/**
 * The URL segment that follows `after` in the browser's address, e.g. usePathId("orders") is the id in
 * /account/orders/<id>. Empty on the server and on the first client render, then the real value.
 *
 * It exists because a page with a dynamic [segment] and no generateStaticParams is rendered on demand, and every such
 * route is one more Vercel serverless function (the Hobby plan allows 12). These pages load their data in the browser
 * anyway, so they are static shells served through a rewrite (see next.config.ts) and read the id from the URL here.
 */
export function usePathId(after: string): string {
    return useSyncExternalStore(
        subscribeNever,
        () => {
            const parts = window.location.pathname.split("/");
            const index = parts.indexOf(after);
            return index >= 0 ? decodeURIComponent(parts[index + 1] ?? "") : "";
        },
        () => ""
    );
}
