import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, ClipboardList, Building2 } from "lucide-react";
import type { ReactNode } from "react";

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
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen bg-neutral-50">
            {/* Brand panel — hidden below lg, the form stands alone on mobile */}
            <div className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-brand-gradient p-12 text-white lg:flex">
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />

                <Link href="/" className="relative inline-flex w-fit items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to store
                </Link>

                <div className="relative">
                    <div className="mb-10 inline-flex w-fit rounded-xl bg-white px-4 py-3 shadow-lg">
                        <Image src="/haitech_medical_logo.png" alt="Haitech Medical" width={170} height={34} className="h-auto w-[160px]" />
                    </div>
                    <h2 className="mb-3 max-w-sm text-3xl font-bold leading-tight tracking-tight">Medical equipment sourcing, simplified.</h2>
                    <p className="max-w-sm text-white/70">One account for orders, quotes and reordering across your organisation.</p>
                </div>

                <ul className="relative space-y-4">
                    {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                                <Icon className="h-4 w-4" />
                            </span>
                            {text}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 sm:py-16">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-8 flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-primary-600 lg:hidden">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Home
                    </Link>

                    <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
                        <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">{title}</h1>
                        <p className="mb-6 text-sm text-neutral-500">{subtitle}</p>
                        {children}
                    </div>

                    {footer}
                </div>
            </div>
        </main>
    );
}
