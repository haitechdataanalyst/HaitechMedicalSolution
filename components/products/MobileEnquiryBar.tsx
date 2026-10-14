import { MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import siteConfig from "@/data/site-config.json";

/**
 * Fixed bottom bar below 1024px with the two fastest enquiry paths. Rendered
 * in the server HTML, so it causes no layout shift; globals.css reserves
 * matching space at the bottom of the page and lifts the floating buttons.
 * "Enquire" links to the contact page so it works without JavaScript; with
 * JavaScript it opens the product quote modal instead.
 */
export default function MobileEnquiryBar({ onEnquire }: { onEnquire: () => void }) {
    const phone = siteConfig.company.phone;

    return (
        <div
            data-mobile-enquiry-bar
            className="material-bar fixed inset-x-0 bottom-0 z-40 border-t border-neutral-900/[0.06] px-4 pt-2.5 lg:hidden"
            style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))" }}
        >
            <div className="mx-auto flex max-w-xl gap-2.5">
                <Link
                    href="/support/contact"
                    onClick={(event) => {
                        event.preventDefault();
                        onEnquire();
                    }}
                    className="btn btn-md btn-primary min-h-12 flex-1 gap-2"
                >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    Enquire
                </Link>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn btn-md btn-secondary min-h-12 gap-2 px-5" aria-label={`Call ${phone}`}>
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call
                </a>
            </div>
        </div>
    );
}
