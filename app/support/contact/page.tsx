import { ContactForm } from '@/components/forms';
import siteConfig from '@/data/site-config.json';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Haitech Medical',
  description: 'Get in touch with Haitech Medical. We\'re here to help with all your medical and dental equipment needs.',
};

const contactMethods = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email Us',
    value: siteConfig.company.email,
    href: `mailto:${siteConfig.company.email}`,
    description: 'We respond within 24 hours',
  },
  {
    id: 'call',
    icon: Phone,
    title: 'Call Us',
    value: siteConfig.company.phone,
    href: `tel:${siteConfig.company.phone.replace(/\s/g, '')}`,
    description: 'Mon-Fri 9am-5pm AEST',
  },
  {
    id: 'info',
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon - Fri: 9:00 AM - 5:00 PM',
    description: 'Australian Eastern Standard Time',
  },
  {
    id: 'address',
    icon: MapPin,
    title: 'Visit Us',
    value: `${siteConfig.company.address.city}, ${siteConfig.company.address.country}`,
    description: siteConfig.company.address.street,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Contact Methods Grid */}
      <section id="email" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              id={method.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{method.title}</h3>
              {method.href ? (
                <a 
                  href={method.href} 
                  className="text-primary-600 hover:underline text-sm font-medium block truncate"
                >
                  {method.value}
                </a>
              ) : (
                <p className="text-sm font-medium truncate">{method.value}</p>
              )}
              <p className="text-xs text-muted mt-1">{method.description}</p>
            </div>
          );
        })}
      </section>

      {/* Contact Form Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="card p-6 md:p-8">
            <h2 className="heading-3 mb-2">Send us a message</h2>
            <p className="text-muted mb-6">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>
        </div>

        {/* Additional Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Support */}
          <div className="bg-primary-50 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Need Quick Support?</h3>
            <p className="text-sm text-muted mb-4">
              For urgent inquiries, call us directly during business hours for immediate assistance.
            </p>
            <a
              href={`tel:${siteConfig.company.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Address Card */}
          <div className="bg-surface-secondary rounded-xl p-6">
            <h3 className="font-semibold mb-3">Our Location</h3>
            <address className="not-italic text-sm text-muted space-y-1">
              <p>{siteConfig.company.address.street}</p>
              <p>{siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}</p>
              <p>{siteConfig.company.address.country}</p>
            </address>
          </div>

          {/* Response Time */}
          <div className="border border-neutral-200 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Response Times</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-muted">Email: Within 24 hours</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-muted">Phone: Immediate (business hours)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="text-muted">Complex inquiries: 2-3 business days</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
