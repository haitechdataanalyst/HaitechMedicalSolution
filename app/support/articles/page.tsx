import { ArticlesPageClient } from "./ArticlesPageClient";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportArticles");

export default function ArticlesPage() {
    return <ArticlesPageClient />;
}
