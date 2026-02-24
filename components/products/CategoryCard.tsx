import Link from "next/link";
import { Category } from "@/types";
import Card, { CardImage, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";

interface CategoryCardProps {
    category: Category;
    href: string;
    childCount?: number;
}

export default function CategoryCard({ category, href, childCount }: CategoryCardProps) {
    return (
        <Link href={href}>
            <Card hover className="h-full">
                <CardImage src={category.image || "/images/placeholder.jpg"} alt={category.name} />
                <CardContent>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && <CardDescription className="line-clamp-2">{category.description}</CardDescription>}
                    <div className="mt-3 flex items-center justify-between">
                        {childCount !== undefined && (
                            <span className="text-muted text-sm">
                                {childCount} {childCount === 1 ? "item" : "items"}
                            </span>
                        )}
                        <span className="text-primary-600 text-sm font-medium">Browse →</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
