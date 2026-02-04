import Link from 'next/link';
import {
  Headset,
  LifeBuoy,
  FileCheck,
  ArrowRight,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import siteConfig from '@/data/site-config.json';

export const metadata = {
  title: 'Support | Haitech Medical',
  description: 'Get help from Haitech Medical. Contact us or browse frequently asked questions.',
};

const supportSections = [
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with our support team for personalized assistance',
    icon: Headset,
    path: '/support/contact',
    color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  },
  {
    id: 'help',
    title: 'Help Center',
    description: 'Browse FAQs, guides, and articles to find answers',
    icon: LifeBuoy,
    path: '/support/faq',
    color: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
  },
  {
    id: 'policies',
    title: 'Policies',
    description: 'Review our privacy policy and other important information',
    icon: FileCheck,
    path: '/support/policies',
    color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-16">
      {/* Quick Links Section */}
      <section className="grid md:grid-cols-3 gap-6">
        {supportSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              href={section.path}
              className="group card p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${section.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="heading-4 mb-2 group-hover:text-primary-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-muted text-sm flex-1">
                {section.description}
              </p>
              <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Quick Contact Info */}
      <section className="bg-surface-secondary rounded-2xl p-8">
        <h2 className="heading-3 text-center mb-8">Quick Contact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Phone */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-muted">Call Us</p>
              <p className="font-semibold">{siteConfig.company.phone}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-muted">Email Us</p>
              <p className="font-semibold">{siteConfig.company.email}</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-muted">Business Hours</p>
              <p className="font-semibold">Mon-Fri 9am-6pm</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
