import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "error" | "info" | "success";

const TONES: Record<Tone, { className: string; icon: typeof Info; role: "alert" | "status" }> = {
    error: { className: "bg-red-50 text-red-700", icon: AlertCircle, role: "alert" },
    info: { className: "bg-primary-50 text-primary-800", icon: Info, role: "status" },
    success: { className: "bg-emerald-50 text-emerald-800", icon: CheckCircle2, role: "status" },
};

/** Quiet tinted message used across the auth flows. */
export default function AuthAlert({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
    const { className: toneClass, icon: Icon, role } = TONES[tone];
    return (
        <div role={role} className={cn("flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm leading-relaxed", toneClass, className)}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0">{children}</div>
        </div>
    );
}
