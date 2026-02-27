import Link from "next/link";
import { Button } from "@/components/ui";
import { Lordicon } from "../icons";

export default function SupportBanner() {
    return (
        <section className="bg-primary-50 border-primary-100 border-y">
            <div className="section container">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="heading-2 text-primary-900 mb-4">Need More Support ?</h2>
                    <p className="text-body-lg mb-8 text-neutral-700">
                        Our dedicated support team is here to help you with product selection, technical assistance, and after-sales service. Get in touch with us today for personalized guidance and
                        expert advice.
                    </p>
                    <Link href="/support/contact">
                        <Button size="lg" variant="solid" className="gap-2 px-20">
                            <Lordicon icon="phone" size={28} parentHover colors={{ primary: "currentColor" }} className="flex-shrink-0" />
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
