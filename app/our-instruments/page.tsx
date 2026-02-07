import { Breadcrumbs } from "@/components/ui";
import { getMedesyData } from "@/lib/catalog";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MedesySelector } from "./MedesySelector";

export const metadata = {
  title: "Medesy Surgical Instruments | Haitech Medical Solutions",
  description:
    "Discover our premium Italian surgical instruments from Medesy. Professional-grade elevators, forceps, periosteal elevators, and scissors. Made in Italy with surgical-grade stainless steel.",
};

export default async function OurInstrumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const medesyData = await getMedesyData();
  const initialCategory = resolvedParams.category || null;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Medesy Instruments", path: "/our-instruments" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-primary-gradient relative overflow-hidden text-white">
        <div className="section-lg container">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="heading-1 mb-6">{medesyData.intro.title}</h1>
            <p className="text-body-lg text-primary-100">
              {medesyData.intro.description}
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-10 md:w-1/3">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <circle cx="300" cy="300" r="200" fill="white" />
          </svg>
        </div>
        <div className="pointer-events-none absolute top-0 left-0 h-full w-1/3 opacity-10">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <circle cx="100" cy="100" r="150" fill="white" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="section container">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-2 mb-8 text-center">Premium Italian Craftsmanship</h2>
          <p className="text-body mb-8 text-center text-gray-600">
            All our surgical instruments are crafted with precision and designed to last:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {medesyData.intro.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="bg-primary-100 text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-800">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments Selection Section */}
      <section className="section-md container mb-10">
        <div className="mb-10 text-center">
          <h2 className="heading-2 mb-4">Browse Our Instrument Categories</h2>
          <p className="text-body mx-auto max-w-2xl text-gray-600">
            Select a category to explore the available instruments. Click on a category card to view all products within that range.
          </p>
        </div>

        <MedesySelector 
          key={initialCategory || 'default'} 
          categories={medesyData.categories} 
          initialCategorySlug={initialCategory} 
        />
      </section>

      {/* CTA Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="heading-3 mb-4">Complete Your Practice Setup</h2>
            <p className="text-body mb-8 text-gray-600">
              Pair your surgical instruments with our premium dental equipment and loupes for a complete clinical solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/product-category/admetec/ergo-loupes">
                <Button variant="primary" size="lg">
                  Explore Loupes
                </Button>
              </Link>
              <Link href="/product-category/almadent/dental-chairs">
                <Button variant="outline" size="lg">
                  Explore Dental Chairs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
