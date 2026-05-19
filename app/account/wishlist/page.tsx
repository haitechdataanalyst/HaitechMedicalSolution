import { getAllProducts, getProductPath } from "@/lib/catalog";
import WishlistPageClient from "./WishlistPageClient";

export default async function WishlistPage() {
    const products = await getAllProducts();
    const productsWithPaths = products.map((p) => ({ ...p, path: getProductPath(p) }));

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-bold text-neutral-900">Wishlist</h1>
                <p className="mt-0.5 text-sm text-neutral-500">Products you've saved for later</p>
            </div>
            <WishlistPageClient products={productsWithPaths} />
        </div>
    );
}
