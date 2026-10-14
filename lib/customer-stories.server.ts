import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import storiesData from "@/data/customer-stories.json";
import { evaluateStories, resolveHomepageSection, resolveStoriesPage } from "./customer-stories";
import type { HomepageSectionState, StoriesPageState, StoryEvaluation } from "./customer-stories";

function evaluateAll(): StoryEvaluation {
    return evaluateStories(storiesData.stories, {
        today: new Date().toISOString().slice(0, 10),
        photoExists: (src) => existsSync(path.join(process.cwd(), "public", src)),
    });
}

/** What the homepage "Dentists who work with Haitech" section should render right now. */
export function getHomepageStorySection(): HomepageSectionState {
    return resolveHomepageSection(evaluateAll(), process.env.NODE_ENV);
}

/** What the customer-stories page should render right now (see lib/customer-stories.ts for the rules). */
export function getStoriesPageState(): StoriesPageState {
    return resolveStoriesPage(evaluateAll(), process.env.NODE_ENV);
}

/** True only when the customer-stories page is publicly live — used by the sitemap. */
export function isStoriesPageLive(): boolean {
    return resolveStoriesPage(evaluateAll(), "production").mode === "live";
}
