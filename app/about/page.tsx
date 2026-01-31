import { Breadcrumbs } from "@/components/ui";
import { AboutSection, TeamGrid } from "@/components/about";
import { Building2, Target, Eye, Users } from "lucide-react";
import teamData from "@/data/team.json";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata = {
  title: "About Us | Haitech Medical Solutions",
  description:
    "Learn about Haitech Medical Solutions - your trusted partner for premium dental and medical equipment in India. Discover our mission, vision, and dedicated team.",
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-primary-gradient text-white overflow-hidden">
        <div className="container section-lg">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="heading-1 mb-6">About Haitech Medical Solutions</h1>
            <p className="text-body-lg text-primary-100">
              Your trusted partner for premium dental and medical equipment,
              empowering healthcare professionals across India since 2013.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 w-1/2 md:w-1/3 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="300" cy="300" r="200" fill="white" />
          </svg>
        </div>
        <div className="absolute left-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="100" cy="100" r="150" fill="white" />
          </svg>
        </div>
      </section>

      {/* Who We Are Section */}
      <AboutSection
        title="Who We Are"
        variant="light"
        icon={<Building2 className="w-8 h-8" />}
      >
        <p>
          At <strong>Haitech Medical Solutions Pvt. Ltd.</strong>, we specialize
          in importing & marketing top-tier dental solutions, including{" "}
          <strong>Admetec Loupes</strong>, <strong>Strauss Diamond Burs</strong>,{" "}
          <strong>Medesy Instruments</strong>, <strong>Salli Stool</strong>,{" "}
          <strong>Dental Chairs</strong>, <strong>Implant Motors</strong>,{" "}
          <strong>Handpieces</strong>, <strong>PTX</strong>,{" "}
          <strong>Suctions & Compressors</strong>.
        </p>
      </AboutSection>

      {/* Our Mission Section */}
      <AboutSection
        title="Our Mission"
        variant="primary"
        icon={<Target className="w-8 h-8 text-white" />}
      >
        <p className="mb-6">
          Our mission is to enhance the lives of dental & medical
          professionals—dentists, hygienists, surgeons, & veterinarians—by
          equipping them with cutting-edge tools to deliver exceptional care &
          achieve healthier outcomes.
        </p>
        <p>
          We are dedicated to fostering strong partnerships across India with
          our network of <strong>27+ dealers</strong>. By providing innovative
          products, personalized support & unwavering commitment, we ensure your
          success at every stage of your professional journey.
        </p>
      </AboutSection>

      {/* Our Vision Section */}
      <AboutSection
        title="Our Vision"
        variant="light"
        icon={<Eye className="w-8 h-8" />}
      >
        <p>
          To be the most trusted partner in advancing dental and medical
          excellence by providing innovative, ergonomic, and precision-driven
          solutions that empower professionals to deliver the highest standard
          of care.
        </p>
      </AboutSection>

      {/* Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 rounded-xl bg-primary-50">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                13+
              </div>
              <div className="text-neutral-600">Years of Experience</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-primary-50">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                27+
              </div>
              <div className="text-neutral-600">Dealer Partners</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-primary-50">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                5+
              </div>
              <div className="text-neutral-600">Premium Brands</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-primary-50">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                1000+
              </div>
              <div className="text-neutral-600">Happy Professionals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamGrid
        members={teamData.team}
        title="Meet Our Team"
        subtitle="The dedicated professionals behind Haitech Medical Solutions who work tirelessly to support your success"
      />

      {/* CTA Section */}
      <section className="section bg-primary-50 border-y border-primary-100">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h2 className="heading-2 text-primary-900 mb-4">
              Partner With Us
            </h2>
            <p className="text-body-lg text-neutral-700 mb-8">
              Join our growing network of dental professionals and dealers
              across India. Let&apos;s work together to deliver excellence in
              dental care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="px-10">
                  Contact Us
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="px-10">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
