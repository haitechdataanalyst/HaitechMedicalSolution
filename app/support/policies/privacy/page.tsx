import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportPrivacy");

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto max-w-4xl">
            {/* Back Link */}
            <Link href="/support/policies" className="text-muted hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Policies
            </Link>

            {/* Header */}
            <div className="mb-10 flex items-center gap-5 rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="heading-2">Privacy Policy</h1>
                    <p className="mt-1 text-sm text-neutral-500">Last updated: July 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-neutral max-w-none">
                <section className="mb-8">
                    <h2 className="heading-4 mb-4">1. Introduction</h2>
                    <p className="text-muted mb-4">
                        Haitech Medical Solutions Pvt. Ltd. (&quot;Haitech Medical,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is
                        committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard
                        information when you visit our website (haitechmedical.com.au), request a quote, place an order, or otherwise interact with us in connection with the
                        distribution of dental and medical equipment to dentists and other oral health professionals in Australia, New Zealand, and beyond.
                    </p>
                    <p className="text-muted mb-4">
                        By using our website or services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our
                        practices, please do not use our website or services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">2. Information We Collect</h2>
                    <h3 className="mb-2 font-semibold">Information You Provide Directly</h3>
                    <p className="text-muted mb-4">We may collect personal information that you provide directly to us when you:</p>
                    <ul className="text-muted mb-4 list-disc space-y-2 pl-6">
                        <li>Register an account on our website</li>
                        <li>Request a quote or place an order</li>
                        <li>Subscribe to our newsletter</li>
                        <li>Submit a contact or support form</li>
                        <li>Correspond with us by email, phone, or live chat</li>
                    </ul>
                    <p className="text-muted mb-4">This information may include your name, email address, mailing address, phone number, clinic or business details, and payment information. We do not knowingly collect sensitive personal data beyond what is necessary to process an inquiry or order.</p>

                    <h3 className="mb-2 font-semibold">Information Collected Automatically</h3>
                    <p className="text-muted mb-4">When you browse our website, we automatically collect certain technical information, including:</p>
                    <ul className="text-muted list-disc space-y-2 pl-6">
                        <li>IP address, browser type and version, device information, and operating system</li>
                        <li>Pages visited, time spent on the site, and referring or exit URLs</li>
                        <li>Products viewed or searched for, and interaction data such as clicks and scrolling</li>
                        <li>Cookies and similar tracking technologies (see Section 5)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">3. How We Use Your Information</h2>
                    <p className="text-muted mb-4">We use the information we collect to:</p>
                    <ul className="text-muted list-disc space-y-2 pl-6">
                        <li>Respond to quote requests, orders, and support inquiries</li>
                        <li>Process and fulfill orders, including shipping and payment processing</li>
                        <li>Personalize your experience and recommend relevant products</li>
                        <li>Understand how visitors use our site and improve its content and performance</li>
                        <li>Send updates about your order, or — with your consent — marketing communications</li>
                        <li>Maintain the security and proper functioning of our website</li>
                        <li>Comply with legal, tax, and regulatory obligations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">4. How We Share Your Information</h2>
                    <p className="text-muted mb-4">We do not sell your personal information. We may share information in the following circumstances:</p>
                    <ul className="text-muted mb-4 list-disc space-y-2 pl-6">
                        <li>
                            <strong>Service Providers:</strong> With third parties who help operate our business, such as hosting providers, payment processors, delivery and
                            logistics partners, analytics services, and email delivery services.
                        </li>
                        <li>
                            <strong>Legal Requirements:</strong> If required by law, regulation, legal process, or governmental request, or to protect the rights, property,
                            or safety of Haitech Medical, our customers, or others.
                        </li>
                        <li>
                            <strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition
                            of all or part of our business.
                        </li>
                        <li>
                            <strong>With Your Consent:</strong> For marketing or promotional purposes, where you have given consent, and you may withdraw that consent at any
                            time.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">5. Cookies and Tracking Technologies</h2>
                    <p className="text-muted mb-4">Our website uses cookies and similar tracking technologies to:</p>
                    <ul className="text-muted mb-4 list-disc space-y-2 pl-6">
                        <li>Remember your preferences and keep you signed in</li>
                        <li>Understand and analyze site traffic and usage patterns (e.g., via tools like Google Analytics)</li>
                        <li>Measure the effectiveness of our marketing and content</li>
                    </ul>
                    <p className="text-muted mb-4">
                        You can control or disable cookies at any time through your browser settings. Please note that disabling cookies may affect certain features or
                        functionality of our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">6. Data Retention</h2>
                    <p className="text-muted mb-4">
                        We retain personal information only for as long as necessary to fulfill the purposes described in this policy — including to provide our services,
                        maintain business and tax records, and resolve disputes — unless a longer retention period is required or permitted by law. When information is no
                        longer needed, we take reasonable steps to securely delete or anonymize it.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">7. Third-Party Links</h2>
                    <p className="text-muted mb-4">
                        Our website may contain links to third-party websites, including manufacturer or brand pages. We are not responsible for the privacy practices or
                        content of those sites, and we encourage you to review their privacy policies before providing any personal information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">8. Your Privacy Rights and Choices</h2>
                    <h3 className="mb-2 font-semibold">Accessing and Updating Your Information</h3>
                    <p className="text-muted mb-4">
                        You have the right to access the personal information we hold about you and to request that we correct, update, or delete it, or restrict or object
                        to certain processing. Depending on your location, additional rights may apply under applicable law (for example, the Australian Privacy Act 1988,
                        the GDPR/UK GDPR for visitors in the EU/UK, or the CCPA for California residents).
                    </p>
                    <h3 className="mb-2 font-semibold">Opting Out of Marketing</h3>
                    <p className="text-muted mb-4">
                        You can unsubscribe from our marketing emails at any time by following the instructions included in the email, or by contacting us directly.
                    </p>
                    <p className="text-muted mb-4">To exercise any of these rights, please contact us using the details in Section 10.</p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">9. Children&apos;s Privacy</h2>
                    <p className="text-muted mb-4">
                        Our website and services are directed at healthcare professionals and businesses, and are not intended for children under 16. We do not knowingly
                        collect personal information from children. If we become aware that we have inadvertently collected such information, we will take steps to delete
                        it promptly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">10. Changes to This Policy</h2>
                    <p className="text-muted mb-4">
                        We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. Any
                        changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.
                    </p>
                </section>

                <section>
                    <h2 className="heading-4 mb-4">11. Contact Us</h2>
                    <p className="text-muted mb-4">If you have any questions or concerns about this Privacy Policy, or wish to exercise your privacy rights, please contact us at:</p>
                    <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                        <p className="font-medium">Haitech Medical Solutions Pvt. Ltd.</p>
                        <p className="text-muted text-sm">Email: info@haitechmedical.com.au</p>
                        <p className="text-muted text-sm">Phone: +91 8291939355</p>
                        <p className="text-muted text-sm">
                            Address: Office No. 912, 9th Floor, Kohinoor Compound, Swastik Disa Corporate Park, Lal Bahadur Shastri Marg, Opp. Shreyas Cinema Road, Nityanand
                            Nagar, Mumbai, Maharashtra, 400086, India
                        </p>
                    </div>
                    <p className="text-muted mt-4">
                        By using our website, you consent to the collection and use of your information as described in this Privacy Policy.
                    </p>
                </section>
            </div>
        </div>
    );
}
