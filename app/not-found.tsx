import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, Package } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-[82vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-primary-100/50 blur-3xl" />
                <div className="absolute right-1/3 bottom-1/4 h-56 w-56 rounded-full bg-navy-100/30 blur-3xl" />
            </div>

            {/* Ghost number */}
            <p className="mb-2 select-none text-[8rem] font-bold leading-none text-neutral-100 md:text-[10rem]">
                404
            </p>

            {/* Label tag */}
            <span className="label-tag label-tag-primary mb-5 inline-flex">Page Not Found</span>

            <h1 className="heading-2 mb-4 max-w-sm text-neutral-900">
                This page doesn&apos;t exist
            </h1>
            <p className="mx-auto mb-10 max-w-sm text-base leading-relaxed text-neutral-500">
                The page you&apos;re looking for may have been moved, removed, or never existed. Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/">
                    <Button size="lg" variant="primary" className="w-full gap-2.5 rounded-full px-8 sm:w-auto">
                        <Home size={16} />
                        Back to Home
                    </Button>
                </Link>
                <Link href="/products">
                    <Button size="lg" variant="outline" className="w-full gap-2.5 rounded-full px-8 sm:w-auto">
                        <Package size={16} />
                        Browse Products
                    </Button>
                </Link>
            </div>

            {/* Brand mark */}
            <div className="mt-16 flex items-center gap-3 opacity-30">
                <div className="h-px w-10 rounded-full bg-neutral-400" />
                <span className="text-xs font-medium tracking-widest text-neutral-500 uppercase">Haitech Medical</span>
                <div className="h-px w-10 rounded-full bg-neutral-400" />
            </div>
        </div>
    );
}
