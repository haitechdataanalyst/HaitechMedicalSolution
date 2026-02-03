import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Haitech Medical',
  description: 'Learn how Haitech Medical collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
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
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
          <Shield className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="heading-2">Privacy Policy</h1>
          <p className="text-sm text-muted">Last updated: January 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-neutral max-w-none">
        <section className="mb-8">
          <h2 className="heading-4 mb-4">Introduction</h2>
          <p className="text-muted mb-4">
            Haitech Medical (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website (haitechmedical.com.au) and use our services, including the 
            distribution of dental products to dentists and other oral health specialists/professionals 
            in Australia and New Zealand.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">Information We Collect</h2>
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <p className="text-muted mb-4">
            We may collect personal information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
            <li>Register on our website</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Fill out a form</li>
            <li>Contact us for support or with inquiries</li>
          </ul>
          <p className="text-muted mb-4">
            This information may include:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Mailing address</li>
            <li>Phone number</li>
            <li>Payment information</li>
          </ul>

          <h3 className="font-semibold mb-2">Non-Personal Information</h3>
          <p className="text-muted mb-4">
            We may also collect non-personal information automatically as you navigate through our website. 
            This information may include:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>Your IP address</li>
            <li>Browser type and version</li>
            <li>Time zone setting</li>
            <li>Browser plug-in types and versions</li>
            <li>Operating system and platform</li>
            <li>Information about your visit, including the URL clickstream to, through, and from our website (including date and time)</li>
            <li>Products you viewed or searched for</li>
            <li>Page response times, download errors, length of visits to certain pages, page interaction information (such as scrolling, clicks, and mouse-overs), and methods used to browse away from the page.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">How We Use Your Information</h2>
          <p className="text-muted mb-4">
            We may use the information we collect from you in the following ways:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>To personalize your experience and to deliver the type of content and product offerings in which you are most interested</li>
            <li>To improve our website and services</li>
            <li>To respond to your customer service requests and support needs</li>
            <li>To process your transactions quickly and efficiently</li>
            <li>To send periodic emails regarding your order or other products and services</li>
            <li>To follow up with you after correspondence (live chat, email, or phone inquiries)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">Disclosure of Your Information</h2>
          <p className="text-muted mb-4">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal processes, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>Marketing Communications:</strong> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</li>
            <li><strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.</li>
            <li><strong>Business Partners:</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">Your Rights and Choices</h2>
          <h3 className="font-semibold mb-2">Opting Out of Email Marketing</h3>
          <p className="text-muted mb-4">
            You can unsubscribe from our marketing emails at any time by following the instructions included in the email. 
            You can also contact us directly to opt out of marketing communications.
          </p>
          <h3 className="font-semibold mb-2">Accessing and Updating Your Information</h3>
          <p className="text-muted mb-4">
            You have the right to access the personal information we hold about you and to request that we correct or delete it. 
            If you wish to exercise these rights, please contact us using the details provided below.
          </p>
        </section>

        <section>
          <h2 className="heading-4 mb-4">Contact Us</h2>
          <p className="text-muted mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-surface-secondary p-4 rounded-lg">
            <p className="font-medium">Haitech Medical</p>
            <p className="text-muted text-sm">Email: info@haitechmedical.com.au</p>
            <p className="text-muted text-sm">Phone: +91 8291939355</p>
            <p className="text-muted text-sm">Address: Office No. 912, 9th Floor, Kohinoor Compound, Swastik Disa Corporate Park, Lal Bahadur Shastri Marg, Opp. Shreyas Cinema Road, Nityanand Nagar, Mumbai, Maharashtra, 400086, India</p>
          </div>
          <p className="text-muted mt-4">
            By using our site, you consent to our website&apos;s privacy policy. This policy may be updated periodically, 
            and we will notify you of any changes by updating the Privacy Policy page on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
