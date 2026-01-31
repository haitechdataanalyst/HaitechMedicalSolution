import Link from "next/link";
import { getTopCategories, getAllProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/products";
import { Button } from "@/components/ui";
import { Hero, SupportBanner } from "@/components/misc";

export default function Home() {
  const categories = getTopCategories();
  const featuredProducts = getAllProducts().slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="section bg-surface-secondary">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6">
              <div className="icon-container icon-container-xl icon-container-primary icon-container-circle mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="heading-4 text-foreground mb-2">
                Premium Quality
              </h3>
              <p className="text-muted">
                Only the finest optical components and materials in all our
                products.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="icon-container icon-container-xl icon-container-primary icon-container-circle mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="heading-4 text-foreground mb-2">Fast Response</h3>
              <p className="text-muted">
                Quote requests answered within 24 hours. Quick Australia-wide
                shipping.
              </p>
            </div>
            <div className="text-center p-6 sm:col-span-2 md:col-span-1">
              <div className="icon-container icon-container-xl icon-container-primary icon-container-circle mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="heading-4 text-foreground mb-2">Expert Support</h3>
              <p className="text-muted">
                Dedicated support team to help you find the perfect equipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="heading-2 text-foreground mb-4">
              Product Categories
            </h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Explore our comprehensive range of medical and dental equipment
              designed for excellence.
            </p>
          </div>
          <ProductGrid items={categories} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section bg-surface-secondary">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 md:mb-12">
            <div className="text-center-mobile">
              <h2 className="heading-2 text-foreground mb-2">
                Featured Products
              </h2>
              <p className="text-body-lg text-muted">
                Our most popular equipment choices
              </p>
            </div>
            <Link href="/products" className="w-full-mobile">
              <Button variant="outline" className="w-full md:w-auto">
                View All Products
              </Button>
            </Link>
          </div>
          <ProductGrid items={featuredProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="heading-2 mb-4">Ready to Upgrade Your Practice?</h2>
          <p className="text-body-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Get in touch with our team for personalized recommendations and
            competitive quotes on all our products.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-100"
              >
                Browse Products
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SupportBanner />
    </>
  );
}
