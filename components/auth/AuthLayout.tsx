import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, ClipboardList, Building2 } from "lucide-react";
import type { ReactNode } from "react";
import { SURFACE_CARD } from "@/components/ui/surfaces";

const HIGHLIGHTS = [
    { icon: ShieldCheck, text: "Secure, session-verified accounts" },
    { icon: ClipboardList, text: "Track orders and quote requests in one place" },
    { icon: Building2, text: "Built for clinics, hospitals and distributors" },
];

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer?: ReactNode;
    /** Optional mark shown above the title (e.g. a shield for MFA). */
    icon?: ReactNode;
    /** Hide the account highlights row (e.g. for focused steps like MFA). */
    showHighlights?: boolean;
    backHref?: string;
    backLabel?: string;
}

export default function AuthLayout({ title, subtitle, children, footer, icon, showHighlights = true, backHref = "/", backLabel = "Back to store" }: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen flex-col bg-neutral-50">
            {/* Quiet top bar: way back + brand */}
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="focus-visible:outline-primary-500 inline-flex min-h-11 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2">
                    <Image src="https://res.cloudinary.com/gwnakzdo/image/upload/v1793162552/haitech/brand/haitech/logo.webp" alt="Haitech Medical home" width={170} height={34} className="h-auto w-[132px] sm:w-[150px]" priority />
                </Link>
                <Link
                    href={backHref}
                    className="focus-visible:outline-primary-500 -mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-neutral-600 transition-colors duration-200 ease-out hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {backLabel}
                </Link>
            </div>

            <div className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:px-6 sm:pt-4">
                <div className="w-full max-w-md">
                    <div className={`${SURFACE_CARD} px-6 py-8 sm:px-10 sm:py-10`}>
                        {icon && <div className="mb-5">{icon}</div>}
                        <h1 className="text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.025em] text-neutral-900 sm:text-[2rem]">{title}</h1>
                        <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{subtitle}</p>
                        <div className="mt-8">{children}</div>
                    </div>

                    {footer}

                    {showHighlights && (
                        <ul className="mt-10 space-y-2.5 px-2">
                            {/* The footer already carries the security note — don't repeat it */}
                            {(footer ? HIGHLIGHTS.slice(1) : HIGHLIGHTS).map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-2.5 text-[13px] text-neutral-500">
                                    <Icon className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
