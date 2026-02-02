import Link from 'next/link';
import { Shield, BadgeCheck, RotateCcw, ArrowRight, FileText } from 'lucide-react';

export const metadata = {
  title: 'Policies | Haitech Medical',
  description: 'Review our privacy policy, warranty information, and returns & refunds policy.',
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
    id: 'warranty',
    icon: BadgeCheck,
    title: 'Extended Warranty',
    description: 'Information about our product warranties and extended coverage options',
    href: '/support/policies/warranty',
    color: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    lastUpdated: 'January 2026',
  },
  {
    id: 'returns',
    icon: RotateCcw,
    title: 'Returns & Refunds Policy',
    description: 'Our procedures for returns, exchanges, and refunds',
    href: '/support/policies/returns',
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
      <section className="mt-12 bg-surface-secondary rounded-2xl p-8">
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
