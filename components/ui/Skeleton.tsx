import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-neutral-200", className)}
            aria-hidden="true"
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-2 p-3.5">
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-2 flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-6 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-2 p-3.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-7 w-24 rounded-full" />
            </div>
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="border-b border-neutral-100 bg-white">
            <div className="container py-10 md:py-12">
                <Skeleton className="mb-3 h-4 w-32" />
                <Skeleton className="mb-2 h-8 w-64 sm:w-96" />
                <Skeleton className="h-5 w-48" />
            </div>
        </div>
    );
}
