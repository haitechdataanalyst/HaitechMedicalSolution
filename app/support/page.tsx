import { ContactForm } from '@/components/forms'
import { FAQ } from '@/components/misc'
import { Breadcrumbs } from '@/components/ui'
import siteConfig from '@/data/site-config.json'
import faqData from '@/data/faq.json'
import { Lordicon } from '@/components/icons'


export const metadata = {
  title: 'Support | Haitech Medical',
  description: 'Get help from Haitech Medical. Contact us or browse frequently asked questions.',
}

export default function SupportPage() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Support', path: '/support' },
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="container section space-y-20">

        {/* CONTACT SECTION */}
        <section className="max-w-5xl mx-auto" />
          <div className="text-center mb-10">
            <h1 className="heading-1 mb-4">Support Center</h1>
            <p className="text-body-lg text-muted">
              Need help? Contact us or explore our FAQs below.
            </p>
          </div>

          <div className="card p-6 md:p-8">
            <h2 className="heading-3 mb-6">Contact Support</h2>
            <ContactForm />
          </div>

        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-10 text-center">

        {/* Phone */}
        <div className="bg-surface-secondary p-5 rounded-xl flex flex-col items-center gap-2">
            <Lordicon
            icon="phone"
            size={40}
            trigger="hover"
            colors={{ primary: "currentColor" }}
            />
            <p className="font-medium">{siteConfig.company.phone}</p>
        </div>

        {/* Email */}
        <div className="bg-surface-secondary p-5 rounded-xl flex flex-col items-center gap-2">
            <Lordicon
            icon="email"
            size={40}
            trigger="hover"
            colors={{ primary: "currentColor" }}
            />
            <p className="font-medium">{siteConfig.company.email}</p>
        </div>

        {/* Location */}
        <div className="bg-surface-secondary p-5 rounded-xl flex flex-col items-center gap-2">
            <Lordicon
            icon="location"
            size={40}
            trigger="hover"
            colors={{ primary: "currentColor" }}
            />
            <p className="font-medium">
            {siteConfig.company.address.city}, {siteConfig.company.address.country}
            </p>
        </div>

        </div>


        {/* FAQ SECTION */}
        <section>
          <FAQ 
            faqs={faqData.faqs} 
            title="Frequently Asked Questions" 
            subtitle="Support FAQ" 
          />
        </section>

      </div>
    </>
  )
}
