import BookingPage from "@/components/forms/BookingPage";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("bookLoupeFitting");

export default function BookLoupeFittingPage() {
    return (
        <BookingPage
            eyebrow="Loupe fitting"
            title="Book a Loupe Fitting"
            intro="Admetec loupes are made to your measurements, so every pair starts with a fitting consultation. Request a fitting and the Haitech team will contact you to arrange it."
            path="/book-loupe-fitting"
            whatYouBook={[
                "A fitting consultation that tailors your loupes to your facial structure, posture and working distance.",
                "A chance to try loupes and discuss magnification, frames and headlights before you order.",
            ]}
            includeInMessage={[
                "Your city and preferred dates.",
                "The loupes or magnification you are interested in, if you know.",
                "Whether you wear prescription glasses.",
                "Your specialty or main procedures, such as general dentistry, endodontics or surgery.",
            ]}
            nextSteps={[
                "Your request reaches the Haitech team. We typically reply within 24 hours.",
                "We arrange the fitting consultation with you.",
                "If you order, your loupes are made to your measurements. Making and shipping can take 6 to 8 weeks.",
            ]}
            form={{
                defaultSubject: "Loupe fitting request",
                messagePlaceholder: "Your city, preferred dates, the loupes you are interested in, and whether you wear prescription glasses.",
                submitLabel: "Request a Fitting",
                successTitle: "Fitting request sent",
                successMessage: "Thank you. The Haitech team will contact you to arrange your loupe fitting.",
                formName: "book_loupe_fitting",
            }}
            relatedLinks={[
                { label: "Browse dental loupes", href: "/dental-loupes" },
                { label: "How to choose dental loupes", href: "/support/articles/choose-perfect-dental-loupes" },
                { label: "LED headlights for loupes", href: "/our-headlights" },
            ]}
        />
    );
}
