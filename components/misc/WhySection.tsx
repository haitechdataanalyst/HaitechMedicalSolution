import Link from "next/link";
import { PILL_ON_DARK } from "@/components/ui/surfaces";
import StatsPanel, { type Stat } from "./StatsPanel";

const stats: Stat[] = [
    { value: "6+", label: "Global Brands" },
    { value: "1500+", label: "Workshops & Conferences Supported" },
    { value: "30+", label: "Active Partnerships" },
    { value: "15+", label: "Years of Excellence" },
];

export default function WhySection() {
    return (
        <StatsPanel
            title="Why Choose Haitech Medical?"
            subtitle="Trusted by dental professionals across India for over a decade of clinical excellence, now expanding our reach globally."
            stats={stats}
        >
            <Link href="/support/contact" className={PILL_ON_DARK}>
                Request a Quote
            </Link>
        </StatsPanel>
    );
}
