import BookingPage from "@/components/forms/BookingPage";
import { getMetadata } from "@/lib/metadata";
import { HUBS, hubPath } from "@/lib/hubs";

export const metadata = getMetadata("bookDemo");

export default function BookDemoPage() {
    return (
        <BookingPage
            eyebrow="Book a demo"
            title="Book a Product Demo"
            intro="See the equipment before you decide. Tell us which product you are considering and where your clinic is, and the Haitech team will contact you to arrange a demonstration."
            path="/book-demo"
            whatYouBook={[
                "A demonstration of the product you are considering, such as a dental chair, CBCT system, endo motor, loupes or a saddle chair.",
                "Time with the Haitech team to ask about specifications, configuration and pricing.",
            ]}
            includeInMessage={[
                "The product or models you want to see.",
                "Your clinic's city and state.",
                "Preferred days and times.",
                "Anything specific you want to check, such as room size or the procedures you perform.",
            ]}
            nextSteps={[
                "Your request reaches the Haitech sales team. We typically reply within 24 hours.",
                "We confirm the product, date, time and place with you.",
                "You see the equipment and can request a quote afterwards.",
            ]}
            form={{
                defaultSubject: "Product demo request",
                messagePlaceholder: "Which product would you like to see? Include your clinic's city and your preferred days and times.",
                submitLabel: "Request a Demo",
                successTitle: "Demo request sent",
                successMessage: "Thank you. The Haitech team will contact you to arrange your demo.",
                formName: "book_demo",
            }}
            relatedLinks={HUBS.map((hub) => ({ label: `Browse ${hub.name}`, href: hubPath(hub) }))}
        />
    );
}
