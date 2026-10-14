import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "./surfaces";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn("rounded-lg bg-neutral-900/[0.06] motion-safe:animate-pulse", className)}
            aria-hidden="true"
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className={cn(SURFACE_CARD, "flex flex-col p-2")}>
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex flex-col gap-2 px-2.5 pt-4 pb-2.5">
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-2 flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className={cn(SURFACE_CARD, "flex flex-col p-2")}>
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex flex-col gap-2 px-2.5 pt-4 pb-2.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="bg-white">
            <div className="container py-10 md:py-14">
                <Skeleton className="mb-3 h-4 w-32" />
                <Skeleton className="mb-3 h-9 w-64 sm:w-96" />
                <Skeleton className="h-5 w-48" />
            </div>
        </div>
    );
}
