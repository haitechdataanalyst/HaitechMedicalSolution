import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/config";

// Production only — dev/staging traffic shouldn't pollute real GA4 data.
export default function GoogleAnalytics() {
    if (process.env.NODE_ENV !== "production") return null;

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}');
                `}
            </Script>
        </>
    );
}
