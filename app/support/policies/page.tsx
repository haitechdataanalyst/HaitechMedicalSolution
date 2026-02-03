import Link from 'next/link';
import { Shield, ArrowRight, FileText } from 'lucide-react';

export const metadata = {
  title: 'Policies | Haitech Medical',
  description: 'Review our privacy policy and other important information.',
};

const policies = [
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information',
    href: '/support/policies/privacy',
    color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    lastUpdated: 'January 2026',
  },
  {
    id: 'extended-warranty',
    icon: Shield,
    title: 'Extended Warranty',
    description: 'Understand coverage details and terms for our extended warranty.',
    href: '/support/policies#extended-warranty',
    color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    lastUpdated: 'January 2026',
  },
  {
    id: 'returns-refunds',
    icon: Shield,
    title: 'Returns & Refunds Policy',
    description: 'View our guidelines for returns, replacements, and refunds.',
    href: '/support/policies#returns-refunds',
    color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    lastUpdated: 'January 2026',
  },
];

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Policy Cards */}
      <section className="space-y-4">
        {policies.map((policy) => {
          const Icon = policy.icon;
          return (
            <Link
              key={policy.id}
              href={policy.href}
              className="group flex items-center gap-6 p-6 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors ${policy.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold group-hover:text-primary-600 transition-colors">
                  {policy.title}
                </h3>
                <p className="text-sm text-muted mt-1">{policy.description}</p>
                <p className="text-xs text-subtle mt-2">Last updated: {policy.lastUpdated}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary-600 group-hover:translate-x-2 transition-all shrink-0" />
            </Link>
          );
        })}
      </section>

      {/* Additional Info */}
      <section className="mt-12 bg-surface-secondary rounded-2xl p-8 space-y-10">
        {/* Details Anchors */}
        <div className="space-y-8">
          <div id="extended-warranty">
            <h3 className="font-semibold mb-2">Extended Warranty</h3>
            <p className="text-sm text-muted">
              This section can outline eligibility, coverage duration, and the process for claiming
              extended warranty support for your products.
            </p>
          </div>

          <div id="returns-refunds">
            <h3 className="font-semibold mb-2">Returns &amp; Refunds Policy</h3>
            <p className="text-sm text-muted">
              This section can describe how to initiate a return, applicable timeframes, and how
              refunds are processed once items are received and inspected.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Questions about our policies?</h3>
            <p className="text-sm text-muted mb-4">
              If you have any questions about our policies or need clarification on any terms, 
              please don&apos;t hesitate to contact our support team.
            </p>
            <Link
              href="/support/contact"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
