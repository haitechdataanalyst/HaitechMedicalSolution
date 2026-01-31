import Link from "next/link";
import { Button } from "@/components/ui";

export default function Hero() {
  return (
    <section className="relative bg-primary-gradient text-white overflow-hidden min-h-100 h-[calc(100vh-8rem)] flex items-center">
      <div className="container section-lg">
        <div className="max-w-3xl relative z-10">
          <h1 className="heading-1 mb-6">Premium Medical & Dental Equipment</h1>
          <p className="text-body-lg text-primary-100 mb-8">
            Australia&apos;s trusted supplier of precision loupes, LED
            headlights, and professional accessories for healthcare
            professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute right-0 bottom-0 w-1/2 md:w-1/3 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="300" cy="300" r="200" fill="white" />
        </svg>
      </div>
    </section>
  );
}
