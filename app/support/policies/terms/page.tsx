import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("supportPolicies");

export default function TermsOfServicePage() {
    return (
        <div className="mx-auto max-w-4xl">
            {/* Back Link */}
            <Link href="/support/policies" className="text-muted hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Policies
            </Link>

            {/* Header */}
            <div className="mb-10 flex items-center gap-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                    <h1 className="heading-2">Terms of Service</h1>
                    <p className="mt-1 text-sm text-neutral-500">Last updated: February 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-neutral max-w-none">
                <section className="mb-8">
                    <h2 className="heading-4 mb-4">1. Introduction</h2>
                    <p className="text-muted mb-4">
                        Welcome to Haitech Medical. These Terms of Service (&quot;Terms&quot;) govern your use of our website, products, and services. By accessing or
                        using our website at haitechmedical.com.au, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not
                        use our services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">2. Definitions</h2>
                    <ul className="text-muted mb-4 list-disc space-y-2 pl-6">
                        <li>
                            <strong>&quot;Company&quot;</strong>, <strong>&quot;we&quot;</strong>, <strong>&quot;us&quot;</strong>, or <strong>&quot;our&quot;</strong>{" "}
                            refers to Haitech Medical, located at Office No. 912, 9th Floor, Kohinoor Compound, Swastik Disa Corporate Park, Mumbai, Maharashtra, 400086,
                            India.
                        </li>
                        <li>
                            <strong>&quot;Service&quot;</strong> refers to the Haitech Medical website and all related services, including product catalog browsing, quote
                            requests, and customer support.
                        </li>
                        <li>
                            <strong>&quot;User&quot;</strong>, <strong>&quot;you&quot;</strong>, or <strong>&quot;your&quot;</strong> refers to any person or entity
                            accessing or using our Service.
                        </li>
                        <li>
                            <strong>&quot;Products&quot;</strong> refers to the dental and medical equipment, instruments, and accessories listed on our website.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">3. Products and Services</h2>
                    <h3 className="mb-2 font-semibold">Product Information</h3>
                    <p className="text-muted mb-4">
                        We make every effort to display our products as accurately as possible. However, we do not guarantee that product descriptions, images, or other
                        content on our website are accurate, complete, reliable, or error-free. Product images may vary due to screen display settings.
                    </p>
                    <h3 className="mb-2 font-semibold">Pricing and Quotes</h3>
                    <p className="text-muted mb-4">
                        Products listed on our website are available on a quote-request basis. Prices provided in quote responses are valid for the period specified in the
                        quote and are subject to change without prior notice. All prices are in AUD unless otherwise stated.
                    </p>
                    <h3 className="mb-2 font-semibold">Availability</h3>
                    <p className="text-muted mb-4">
                        All products are subject to availability. We reserve the right to discontinue any product at any time without notice. If a product you have
                        requested a quote for becomes unavailable, we will notify you promptly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">4. Quote Requests and Orders</h2>
                    <p className="text-muted mb-4">
                        Submitting a quote request through our website does not constitute a binding order. A binding agreement is formed only when we confirm your order in
                        writing (including via email). We reserve the right to refuse or cancel any order at our discretion.
                    </p>
                    <p className="text-muted mb-4">
                        By submitting a quote request, you confirm that all information provided is accurate and complete. You agree to provide valid contact information to
                        facilitate communication regarding your request.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">5. Intellectual Property</h2>
                    <p className="text-muted mb-4">
                        All content on this website, including but not limited to text, graphics, logos, images, product descriptions, and software, is the property of
                        Haitech Medical or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
                    </p>
                    <p className="text-muted mb-4">
                        You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of the content on our website without prior
                        written consent from Haitech Medical.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">6. User Conduct</h2>
                    <p className="text-muted mb-4">When using our website, you agree not to:</p>
                    <ul className="text-muted mb-4 list-disc space-y-2 pl-6">
                        <li>Use the service for any unlawful purpose or in violation of these Terms</li>
                        <li>Attempt to interfere with, compromise, or disrupt the system integrity or security</li>
                        <li>Submit false, misleading, or fraudulent quote requests or information</li>
                        <li>Use automated means (bots, scrapers) to access or collect data from our website</li>
                        <li>Impersonate another person or misrepresent your affiliation with any entity</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">7. Warranty and Liability</h2>
                    <h3 className="mb-2 font-semibold">Product Warranties</h3>
                    <p className="text-muted mb-4">
                        Products sold through Haitech Medical carry the manufacturer&apos;s warranty as specified in the product documentation. Warranty terms vary by
                        product and brand. Please refer to individual product specifications or contact our support team for details.
                    </p>
                    <h3 className="mb-2 font-semibold">Limitation of Liability</h3>
                    <p className="text-muted mb-4">
                        To the fullest extent permitted by applicable law, Haitech Medical shall not be liable for any indirect, incidental, special, consequential, or
                        punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly, or any loss of data, use, or goodwill arising from
                        your use of our Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">8. Returns and Refunds</h2>
                    <p className="text-muted mb-4">
                        Return and refund policies vary by product type and brand. Generally, products may be returned within 30 days of delivery if they are in original,
                        unopened condition. Custom-configured products (such as prescription loupes) may not be eligible for return. Please contact our support team for
                        specific return eligibility before initiating a return.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">9. Privacy</h2>
                    <p className="text-muted mb-4">
                        Your use of our Service is also governed by our{" "}
                        <Link href="/support/policies/privacy" className="text-primary-600 hover:text-primary-700 underline">
                            Privacy Policy
                        </Link>
                        , which describes how we collect, use, and protect your personal information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">10. Modifications to Terms</h2>
                    <p className="text-muted mb-4">
                        We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the
                        Service following the posting of revised Terms constitutes acceptance of those changes.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="heading-4 mb-4">11. Governing Law</h2>
                    <p className="text-muted mb-4">
                        These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or the
                        Service shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
                    </p>
                </section>

                <section>
                    <h2 className="heading-4 mb-4">12. Contact Us</h2>
                    <p className="text-muted mb-4">If you have any questions about these Terms of Service, please contact us at:</p>
                    <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                        <p className="font-medium">Haitech Medical</p>
                        <p className="text-muted text-sm">Email: info@haitechmedical.com.au</p>
                        <p className="text-muted text-sm">Phone: +91 8291939355</p>
                        <p className="text-muted text-sm">
                            Address: Office No. 912, 9th Floor, Kohinoor Compound, Swastik Disa Corporate Park, Lal Bahadur Shastri Marg, Opp. Shreyas Cinema Road,
                            Nityanand Nagar, Mumbai, Maharashtra, 400086, India
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
