import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PILL_PRIMARY } from "@/components/ui/surfaces";

const SECONDARY_LINK =
    "text-primary-700 hover:text-primary-800 inline-flex min-h-12 items-center gap-1 rounded-full px-4 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

export default function NotFound() {
    return (
        <div className="container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center md:py-32">
            <p className="text-[15px] font-medium text-neutral-500 tabular-nums">Error 404</p>

            <h1 className="mt-3 max-w-xl text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl">This page doesn&apos;t exist</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-neutral-500 md:text-lg">
                The page you&apos;re looking for may have been moved, removed, or never existed. Let&apos;s get you back on track.
            </p>

            <div className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <Link href="/" className={`${PILL_PRIMARY} w-full sm:w-auto`}>
                    Back to Home
                </Link>
                <Link href="/products" className={SECONDARY_LINK}>
                    Browse Products
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
