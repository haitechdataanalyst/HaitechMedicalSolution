import { RotateCcw, ArrowLeft, Package, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Returns & Refunds Policy | Haitech Medical',
  description: 'Our procedures for returns, exchanges, and refunds at Haitech Medical.',
};

const returnSteps = [
  {
    step: 1,
    title: 'Contact Us',
    description: 'Reach out to our support team within 30 days of delivery with your order number',
  },
  {
    step: 2,
    title: 'Get Approval',
    description: 'Our team will review your request and provide a Return Authorization (RA) number',
  },
  {
    step: 3,
    title: 'Ship the Item',
    description: 'Pack the item securely in original packaging and ship to our returns center',
  },
  {
    step: 4,
    title: 'Receive Refund',
    description: 'Once inspected, your refund will be processed within 5-7 business days',
  },
];

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto">
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
        <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center">
          <RotateCcw className="w-7 h-7 text-amber-600" />
        </div>
        <div>
          <h1 className="heading-2">Returns & Refunds Policy</h1>
          <p className="text-sm text-muted">Last updated: January 2026</p>
        </div>
      </div>

      {/* Key Points Banner */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-sm">30 Days</p>
          <p className="text-xs text-muted">Return Window</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-sm">Free Returns</p>
          <p className="text-xs text-muted">On Defective Items</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-sm">5-7 Days</p>
          <p className="text-xs text-muted">Refund Processing</p>
        </div>
      </div>

      {/* Return Process */}
      <section className="mb-12">
        <h2 className="heading-3 mb-6">Return Process</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {returnSteps.map((item) => (
            <div key={item.step} className="relative">
              <div className="bg-white border border-neutral-200 rounded-xl p-4 h-full">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="space-y-6">
        <h2 className="heading-3 mb-6">Policy Details</h2>

        {/* Eligibility */}
        <div className="bg-surface-secondary rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Eligible for Return
          </h3>
          <ul className="list-disc pl-6 text-muted text-sm space-y-2">
            <li>Unused items in original packaging</li>
            <li>Items returned within 30 days of delivery</li>
            <li>Defective or damaged items (report within 48 hours of delivery)</li>
            <li>Items that don&apos;t match the description</li>
            <li>Items with all original accessories, manuals, and components</li>
          </ul>
        </div>

        {/* Not Eligible */}
        <div className="bg-red-50 rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Not Eligible for Return
          </h3>
          <ul className="list-disc pl-6 text-red-800 text-sm space-y-2">
            <li>Items that have been used, installed, or modified</li>
            <li>Custom or personalized orders</li>
            <li>Consumable items (unless defective)</li>
            <li>Items returned without original packaging</li>
            <li>Items past the 30-day return window</li>
            <li>Items damaged due to customer misuse</li>
          </ul>
        </div>

        {/* Refunds */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h3 className="font-semibold mb-3">Refund Information</h3>
          <div className="space-y-4 text-sm text-muted">
            <p>
              <strong className="text-foreground">Processing Time:</strong> Refunds are processed 
              within 5-7 business days after we receive and inspect the returned item.
            </p>
            <p>
              <strong className="text-foreground">Refund Method:</strong> Refunds will be issued 
              to the original payment method. Credit card refunds may take an additional 3-5 business 
              days to appear on your statement.
            </p>
            <p>
              <strong className="text-foreground">Shipping Costs:</strong> Original shipping costs 
              are non-refundable unless the return is due to our error or a defective product. 
              Return shipping costs are the customer&apos;s responsibility unless otherwise specified.
            </p>
            <p>
              <strong className="text-foreground">Restocking Fee:</strong> A 15% restocking fee may 
              apply to returns that are not due to defects or our error.
            </p>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h3 className="font-semibold mb-3">Exchanges</h3>
          <p className="text-sm text-muted">
            We offer exchanges for items of equal or lesser value. If you need to exchange an item 
            for a different product, please contact our support team. Exchanges are subject to 
            product availability.
          </p>
        </div>

        {/* Damaged Items */}
        <div className="bg-amber-50 rounded-xl p-6">
          <h3 className="font-semibold mb-3">Damaged or Defective Items</h3>
          <p className="text-sm text-amber-800 mb-3">
            If you receive a damaged or defective item:
          </p>
          <ol className="list-decimal pl-6 text-amber-800 text-sm space-y-2">
            <li>Document the damage with photos</li>
            <li>Contact us within 48 hours of delivery</li>
            <li>Do not discard the packaging until the claim is resolved</li>
            <li>We will arrange free return shipping for verified defective items</li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 bg-primary-50 rounded-2xl p-8 text-center">
        <h3 className="heading-4 mb-2">Need to Start a Return?</h3>
        <p className="text-muted mb-4">
          Contact our support team to initiate a return or ask questions about our policy.
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
