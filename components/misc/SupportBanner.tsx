import Link from "next/link";
import { Button } from "@/components/ui";
import { Lordicon } from "../icons";

export default function SupportBanner() {
  return (
    <section className="bg-primary-50 border-y border-primary-100">
      <div className="container section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-2 text-primary-900 mb-4">
            Need More Support ?
          </h2>
          <p className="text-body-lg text-neutral-700 mb-8">
            Our dedicated support team is here to help you with product
            selection, technical assistance, and after-sales service. Get in
            touch with us today for personalized guidance and expert advice.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="solid" className="px-20 gap-2">
              <Lordicon 
                icon="phone" 
                size={28} 
                parentHover 
                colors={{ primary: "currentColor" }}
                className="flex-shrink-0"
              />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
