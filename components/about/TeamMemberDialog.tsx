"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { TeamMemberData } from "./TeamMember";

interface Props {
    member: TeamMemberData | null;
    onClose: () => void;
}

const FOCUSABLE = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function TeamMemberDialog({ member, onClose }: Props) {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!member) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            // Keep Tab inside the sheet while it is open.
            if (e.key !== "Tab" || !dialogRef.current) return;
            const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 20);
        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
            previouslyFocused?.focus();
        };
    }, [member, onClose]);

    if (!member || typeof document === "undefined") return null;

    const displayName = member.name.replace(/^(Mr\.|Mrs\.|Ms\.)\s*/i, "");

    // Strip leading emoji from tags for cleaner layout
    const cleanTags = member.tags?.map((t) => t.replace(/^\S+\s+/, "")) ?? [];

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Scrim */}
            <div className="pointer-events-none absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" aria-hidden="true" />

            {/* Sheet */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="team-member-dialog-title"
                tabIndex={-1}
                className="animate-popover-in relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_24px_64px_-24px_rgba(15,23,42,0.4)] outline-none sm:max-w-xl sm:rounded-3xl md:max-w-2xl md:flex-row"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close profile"
                    className="focus-visible:outline-primary-500 absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/[0.05] text-neutral-600 transition-colors duration-200 ease-out hover:bg-neutral-900/10 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <X className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
                </button>

                {/* Portrait */}
                <div className="flex shrink-0 items-center justify-center bg-neutral-50 px-8 pt-10 pb-8 md:w-56 md:py-12 lg:w-64">
                    <MemberPhoto member={member} displayName={displayName} />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col overflow-y-auto px-7 pt-7 pb-8 md:p-9 md:pr-14">
                    <h2 id="team-member-dialog-title" className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-neutral-900">
                        {displayName}
                    </h2>
                    <p className="mt-1 text-[15px] text-neutral-500">{member.designation}</p>

                    <p className="mt-6 flex-1 text-[16px] leading-relaxed text-neutral-700">{member.bio ?? "A valued member of the Haitech Medical family."}</p>

                    {cleanTags.length > 0 && (
                        <div className="mt-7">
                            <p className="text-[13px] font-medium text-neutral-500">Known for</p>
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {cleanTags.map((tag) => (
                                    <li key={tag} className="label-tag label-tag-neutral">
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

function MemberPhoto({ member, displayName }: { member: TeamMemberData; displayName: string }) {
    const [failed, setFailed] = useState(false);

    const initials = displayName
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="relative aspect-[4/5] w-32 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 md:w-full">
            {member.image && !failed ? (
                <Image src={member.image} alt={member.name} fill sizes="(max-width: 768px) 128px, 256px" className="object-cover" onError={() => setFailed(true)} />
            ) : (
                <div className="bg-primary-50 text-primary-800 flex h-full w-full items-center justify-center text-2xl font-semibold">{initials}</div>
            )}
        </div>
    );
}
