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
          <h2 className="heading-4 mb-4">1. Introduction</h2>
          <p className="text-muted mb-4">
            Haitech Medical (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website or use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">2. Information We Collect</h2>
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <p className="text-muted mb-4">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
            <li>Register for an account</li>
            <li>Make a purchase or request a quote</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us through our support channels</li>
            <li>Participate in promotions or surveys</li>
          </ul>
          <p className="text-muted mb-4">
            This information may include your name, email address, phone number, postal address, 
            payment information, and any other information you choose to provide.
          </p>

          <h3 className="font-semibold mb-2">Automatically Collected Information</h3>
          <p className="text-muted mb-4">
            When you visit our website, we automatically collect certain information about your device, including:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">3. How We Use Your Information</h2>
          <p className="text-muted mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>Processing and fulfilling your orders</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Sending promotional communications (with your consent)</li>
            <li>Improving our website and services</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">4. Information Sharing</h2>
          <p className="text-muted mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>Service providers who assist in our operations (payment processors, shipping carriers)</li>
            <li>Business partners for joint marketing initiatives (with your consent)</li>
            <li>Legal authorities when required by law or to protect our rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">5. Data Security</h2>
          <p className="text-muted mb-4">
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">6. Your Rights</h2>
          <p className="text-muted mb-4">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 text-muted space-y-2">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">7. Cookies</h2>
          <p className="text-muted mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our website. 
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="heading-4 mb-4">8. Contact Us</h2>
          <p className="text-muted mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-surface-secondary p-4 rounded-lg">
            <p className="font-medium">Haitech Medical</p>
            <p className="text-muted text-sm">Email: sales@haitech-group.com</p>
            <p className="text-muted text-sm">Phone: +91 8291939355</p>
          </div>
        </section>

        <section>
          <h2 className="heading-4 mb-4">9. Updates to This Policy</h2>
          <p className="text-muted">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>
      </div>
    </div>
  );
}
