import { FAQ } from "@/components/misc";
import data from "@/data/faq.json";
import Link from "next/link";
import { PlaySquare, FileText, GitCompare, ArrowRight, FileTerminalIcon } from "lucide-react";
import { ArticlesPageClient } from "../articles/ArticlesPageClient";
import { id } from "zod/locales";

export const metadata = {
  title: 'Help Center | Haitech Medical',
  description: 'Find answers to frequently asked questions, browse guides, and get help with Haitech Medical products.',
};

const helpResources = [
  {
    id: 'guides',
    icon: PlaySquare,
    title: 'Product Guides',
    description: 'Step-by-step tutorials and video guides for our products',
    href: '#guides',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'articles',
    icon: FileText,
    title: 'Knowledge Base',
    description: 'In-depth articles and documentation',
    href: '#articles',
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 'terms',
    icon: FileTerminalIcon,
    title: 'Policies',
    description: 'Our Policies & terms and Conditions',
    href: '/support/policies',
    color: 'bg-purple-50 text-purple-600',}
];

export default function HelpCenterPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Quick Resources */}
      <section className="grid md:grid-cols-3 gap-4 mb-12">
        {helpResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Link
              key={resource.id}
              href={resource.href}
              id={resource.id}
              className="group flex items-start gap-4 p-4 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${resource.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm group-hover:text-primary-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted mt-0.5">{resource.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </Link>
          );
        })}
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ 
          faqs={data.faqs} 
          title="Frequently Asked Questions" 
          subtitle="Find answers to the most common questions about our products and services."
        />
      </section>

      {/* Articles Section */}
      <section id="articles" className="mt-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Knowledge Base</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find helpful articles, guides, and resources about our products and services
          </p>
        </div>
        <ArticlesPageClient />
      </section>

      {/* Still need help CTA */}
      <section className="mt-12 bg-primary-50 rounded-2xl p-8 text-center">
        <h3 className="heading-4 mb-2">Still need help?</h3>
        <p className="text-muted mb-4">
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <Link
          href="/support/contact"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Contact Support
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}