import { BadgeCheck, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Extended Warranty | Haitech Medical',
  description: 'Information about product warranties and extended coverage options at Haitech Medical.',
};

const warrantyTiers = [
  {
    name: 'Standard Warranty',
    duration: '1-2 Years',
    description: 'Included with all products',
    features: [
      'Manufacturing defects coverage',
      'Parts replacement',
      'Technical support',
      'Standard repair turnaround',
    ],
    highlighted: false,
  },
  {
    name: 'Extended Warranty',
    duration: '3-5 Years',
    description: 'Additional peace of mind',
    features: [
      'All Standard Warranty benefits',
      'Extended parts coverage',
      'Priority technical support',
      'Expedited repair service',
      'Annual maintenance check',
    ],
    highlighted: true,
  },
  {
    name: 'Premium Care',
    duration: '5+ Years',
    description: 'Comprehensive protection',
    features: [
      'All Extended Warranty benefits',
      'Accidental damage protection',
      'Loaner equipment during repairs',
      'On-site service (where available)',
      'Free upgrades when available',
      'Dedicated account manager',
    ],
    highlighted: false,
  },
];

export default function WarrantyPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        href="/support/policies"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Policies
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
          <BadgeCheck className="w-7 h-7 text-green-600" />
        </div>
        <div>
          <h1 className="heading-2">Extended Warranty</h1>
          <p className="text-sm text-muted">Last updated: January 2026</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-green-50 rounded-2xl p-6 mb-10">
        <p className="text-green-800">
          All Haitech Medical products come with a manufacturer warranty. We also offer extended 
          warranty options for additional protection and peace of mind.
        </p>
      </div>

      {/* Warranty Tiers */}
      <section className="mb-12">
        <h2 className="heading-3 mb-6">Warranty Options</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {warrantyTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 ${
                tier.highlighted
                  ? 'bg-primary-50 border-2 border-primary-300 relative'
                  : 'bg-white border border-neutral-200'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
              <p className="text-2xl font-bold text-primary-600 mb-2">{tier.duration}</p>
              <p className="text-sm text-muted mb-4">{tier.description}</p>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="prose prose-neutral max-w-none">
        <h2 className="heading-3 mb-6">Warranty Terms & Conditions</h2>

        <div className="space-y-6">
          <div className="bg-surface-secondary rounded-xl p-6">
            <h3 className="font-semibold mb-3">Coverage</h3>
            <p className="text-muted text-sm">
              Our warranty covers defects in materials and workmanship under normal use. 
              This includes electronic components, mechanical parts, and structural elements 
              of the product.
            </p>
          </div>

          <div className="bg-surface-secondary rounded-xl p-6">
            <h3 className="font-semibold mb-3">Exclusions</h3>
            <p className="text-muted text-sm mb-3">The warranty does not cover:</p>
            <ul className="list-disc pl-6 text-muted text-sm space-y-1">
              <li>Damage from misuse, abuse, or neglect</li>
              <li>Normal wear and tear</li>
              <li>Damage from unauthorized modifications or repairs</li>
              <li>Cosmetic damage (scratches, dents)</li>
              <li>Damage from environmental factors (water, extreme temperatures)</li>
              <li>Consumable items (batteries, bulbs, filters)</li>
            </ul>
          </div>

          <div className="bg-surface-secondary rounded-xl p-6">
            <h3 className="font-semibold mb-3">How to Make a Warranty Claim</h3>
            <ol className="list-decimal pl-6 text-muted text-sm space-y-2">
              <li>Contact our support team with your order number and product details</li>
              <li>Describe the issue you are experiencing</li>
              <li>Our team will diagnose the problem and determine warranty eligibility</li>
              <li>If approved, we will provide instructions for repair or replacement</li>
              <li>Ship the product to our service center (prepaid label provided for valid claims)</li>
            </ol>
          </div>

          <div className="bg-surface-secondary rounded-xl p-6">
            <h3 className="font-semibold mb-3">Extended Warranty Purchase</h3>
            <p className="text-muted text-sm">
              Extended warranties must be purchased within 30 days of the original product purchase. 
              Contact our sales team for pricing and availability for your specific products.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 bg-primary-50 rounded-2xl p-8 text-center">
        <h3 className="heading-4 mb-2">Need Warranty Support?</h3>
        <p className="text-muted mb-4">
          Contact our support team to make a warranty claim or learn more about extended coverage options.
        </p>
        <Link
          href="/support/contact"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Contact Support
        </Link>
      </section>
    </div>
  );
}
