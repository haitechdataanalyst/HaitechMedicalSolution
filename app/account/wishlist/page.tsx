import { getAllProducts, getProductPath } from "@/lib/catalog";
import WishlistPageClient from "./WishlistPageClient";

export default async function WishlistPage() {
    const products = await getAllProducts();
    const productsWithPaths = await Promise.all(
        products.map(async (p) => ({ ...p, path: await getProductPath(p) }))
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.025em] text-neutral-900 md:text-4xl">Wishlist</h1>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-500 md:text-base">Products you&apos;ve saved for later</p>
            </div>
            <WishlistPageClient products={productsWithPaths} />
        </div>
    );
}
