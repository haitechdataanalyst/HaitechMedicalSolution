import Link from "next/link";
import { getTopCategories, getAllProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/products";
import { Button } from "@/components/ui";
import { Hero, SupportBanner, Testimonials, TrendingProducts, WhySection } from "@/components/misc";

export default function Home() {
  const categories = getTopCategories();
  const featuredProducts = getAllProducts().slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="section bg-surface-secondary">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            <div className="p-6 text-center">
              <div className="icon-container icon-container-xl icon-container-primary icon-container-circle mx-auto mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heading-4 text-foreground mb-2">Premium Quality</h3>
              <p className="text-muted">Only the finest optical components and materials in all our products.</p>
            </div>
            <div className="p-6 text-center">
              <div className="icon-container icon-container-xl icon-container-primary icon-container-circle mx-auto mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heading-4 text-foreground mb-2">Fast Response</h3>
              <p className="text-muted">Quote requests answered within 24 hours. Quick Australia-wide shipping.</p>
            </div>
            <div className="p-6 text-center sm:col-span-2 md:col-span-1">
              <div className="icon-container icon-container-xl icon-container-primary icon-container-circle mx-auto mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="heading-4 text-foreground mb-2">Expert Support</h3>
              <p className="text-muted">Dedicated support team to help you find the perfect equipment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <WhySection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Featured Products Section */}
      <TrendingProducts products={featuredProducts} />

      {/* CTA Section */}
      <section className="section-lg bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="heading-2 mb-4">Ready to Upgrade Your Practice?</h2>
          <p className="text-body-lg text-primary-100 mx-auto mb-8 max-w-2xl">Get in touch with our team for personalized recommendations and competitive quotes on all our products.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="text-primary-600 w-full bg-white hover:bg-neutral-100 sm:w-auto">
                Browse Products
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 sm:w-auto">
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
