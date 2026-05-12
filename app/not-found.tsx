import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
            {/* Large 404 */}
            <p className="text-primary-200 mb-2 text-[8rem] font-bold leading-none select-none">404</p>

            <h1 className="heading-2 text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted mx-auto mb-10 max-w-md text-base">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved. Try browsing our products or heading back home.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/products">
                    <Button size="lg">Browse Products</Button>
                </Link>
                <Link href="/">
                    <Button size="lg" variant="outline">Go to Home</Button>
                </Link>
            </div>

            {/* Subtle brand decoration */}
            <div className="mt-16 flex items-center gap-2 opacity-40">
                <div className="bg-primary-400 h-1 w-8 rounded-full" />
                <p className="text-muted text-sm">Haitech Medical</p>
                <div className="bg-primary-400 h-1 w-8 rounded-full" />
            </div>
        </div>
    );
}
