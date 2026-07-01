import { ArticleData } from "./articleTypes";

export const articleLoupeMaintenance: ArticleData = {
    id: 3,
    title: "How to Clean and Maintain Your Loupes and Lights",
    slug: "clean-maintain-loupes-lights",
    category: "Lights & Loupes",
    excerpt: "A step-by-step guide to keeping your surgical loupes and LED lights clean, safe, and long-lasting.",
    content: (
        <>
            {/* Top Image */}
            <img src="/images/Admetec-Butterfly-S-Case-Loupes-Included.jpg" alt="Magnification comparison" className="mx-auto mb-6 block h-auto w-full max-w-md rounded-lg shadow-md" />

            {/* Intro */}
            <p className="mb-6 leading-relaxed text-gray-700">
                Loupes, including Ergo Loupes (also known as Ergonomic loupes), are essential tools for medical professionals, providing enhanced vision and precision during procedures. Proper care
                and maintenance of your loupes and lights are crucial to ensure their longevity and optimal performance.
            </p>

            <p className="mb-10 leading-relaxed text-gray-700">
                This comprehensive guide, brought to you by Byron Medical and Admetec, will walk you through the necessary steps to clean and maintain your surgical loupes effectively.
            </p>

            {/* Cleaning */}
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Cleaning Your Loupes</h2>

            <ol className="mb-10 list-inside list-decimal space-y-4 leading-relaxed text-gray-700">
                <li>
                    <strong>Separate Battery from Light:</strong> Before cleaning your loupes light, always separate the battery from the light to avoid any electrical issues.
                </li>
                <li>
                    <strong>Remove Debris and Wipe Down:</strong> Use a neutral detergent or a lens cleaner with less than 30% alcohol content to remove any accumulated debris from your loupes. Gently
                    wipe down the loupes and lights.
                </li>
                <li>
                    <strong>Drying:</strong> After cleaning your loupes, dry any moisture with a microfiber cloth. Avoid using paper towels on your loupes’ lens as they can scratch the lens coating.
                </li>
                <li>
                    <strong>Avoid Submersion:</strong> Never submerge your loupes, lights, or batteries in water. This can cause irreparable damage.
                </li>
            </ol>

            {/* Charging */}
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Charging Your Lights</h2>

            <ol className="mb-10 list-inside list-decimal space-y-4 leading-relaxed text-gray-700">
                <li>
                    <strong>Cool Down:</strong> Allow your LED light batteries to cool after use before charging them.
                </li>
                <li>
                    <strong>Proper Docking:</strong> Ensure that cordless Butterfly batteries are placed correctly on the charging dock with the light display on. Improper docking can cause
                    overheating and failure of the batteries or charger.
                </li>
                <li>
                    <strong>Avoid Overcharging:</strong> Do not leave batteries docked on the charger for extended periods or overnight.
                </li>
                <li>
                    <strong>Safety Precautions:</strong> Do not charge lithium-ion batteries near flammable substances.
                </li>
            </ol>

            {/* Storage */}
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Storing Your Ergo Loupes, TTL Loupes, or Surgical Loupes</h2>

            <ol className="mb-10 list-inside list-decimal space-y-4 leading-relaxed text-gray-700">
                <li>
                    <strong>Cool, Dry Place:</strong> Store batteries, loupes, and lights in a cool, dry place when not in use.
                </li>
                <li>
                    <strong>Remove from Charger:</strong> Remove and store batteries from the charger when fully charged to preserve battery life and prevent overheating.
                </li>
                <li>
                    <strong>Loosen Head Strap:</strong> Loosen the head strap when removing loupes to avoid wear on the strap.
                </li>
                <li>
                    <strong>Avoid Extreme Temperatures:</strong> Do not expose batteries or chargers to extreme temperatures.
                </li>
                <li>
                    <strong>Proper Disposal:</strong> Dispose of lithium-ion batteries at an authorized recycler at the end of their life.
                </li>
            </ol>

            {/* Closing */}
            <p className="mt-6 leading-relaxed text-gray-700">
                By following these guidelines, you can ensure that your loupes remain in excellent condition, providing you with reliable performance for years to come. If you have any questions,
                Byron Medical’s friendly customer service team is always happy to assist.
            </p>
        </>
    ),
    publishedAt: "2024-12-11",
    author: "Tom Mittelman",
    readTime: "5 min read",
    publishedTime: "02:39pm",
    views: 127,
    imageSrc: "/images/Admetec-Butterfly-S-Case-Loupes-Included.jpg",
    imageAlt: "Magnification comparison",
};
