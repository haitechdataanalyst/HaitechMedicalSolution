import { ContactForm } from '@/components/forms';
import { Breadcrumbs } from '@/components/ui';
import siteConfig from '@/data/site-config.json';

export const metadata = {
  title: 'Contact Us | Haitech Medical',
  description: 'Get in touch with Haitech Medical. We\'re here to help with all your medical and dental equipment needs.',
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="container section">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="heading-1 text-[var(--foreground)] mb-4">Contact Us</h1>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Have a question about our products or need assistance? We&apos;re here to help.
              Fill out the form below or reach out to us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-6 md:p-8">
                <h2 className="heading-3 text-[var(--foreground)] mb-6">Send us a message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 md:space-y-6">
              {/* Phone */}
              <div className="bg-surface-secondary rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-container-lg icon-container-primary shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)]">Phone</h3>
                    <p className="text-muted mt-1">{siteConfig.company.phone}</p>
                    <p className="text-sm text-subtle mt-1">Mon-Fri 9am-5pm AEST</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-surface-secondary rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-container-lg icon-container-primary shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <a
                      href={`mailto:${siteConfig.company.email}`}
                      className="text-primary-600 hover:underline mt-1 block break-all"
                    >
                      {siteConfig.company.email}
                    </a>
                    <p className="text-sm text-subtle mt-1">We respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-surface-secondary rounded-xl p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="icon-container icon-container-lg icon-container-primary shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)]">Address</h3>
                    <p className="text-muted mt-1">
                      {siteConfig.company.address.street}<br />
                      {siteConfig.company.address.city}, {siteConfig.company.address.state} {siteConfig.company.address.postcode}<br />
                      {siteConfig.company.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
