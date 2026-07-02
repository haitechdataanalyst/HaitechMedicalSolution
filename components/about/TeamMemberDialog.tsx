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

export function TeamMemberDialog({ member, onClose }: Props) {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!member) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        setTimeout(() => dialogRef.current?.focus(), 20);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [member, onClose]);

    if (!member || typeof document === "undefined") return null;

    const displayName = member.name.replace(/^(Mr\.|Mrs\.|Ms\.)\s*/i, "");

    // Strip leading emoji from tags for cleaner layout
    const cleanTags = member.tags?.map((t) => t.replace(/^\S+\s+/, "")) ?? [];

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Profile: ${member.name}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

            {/* Sheet/panel */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative z-10 flex w-full flex-col overflow-hidden rounded-t-2xl bg-white outline-none
                           sm:max-w-xl sm:rounded-2xl md:max-w-2xl md:flex-row"
                style={{ animation: "teamDialogIn 0.22s cubic-bezier(0.22,1,0.36,1) both", maxHeight: "92vh" }}
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 p-1 text-neutral-400 transition-colors hover:text-neutral-700"
                >
                    <X size={18} strokeWidth={2} />
                </button>

                {/* Photo column */}
                <div className="flex shrink-0 flex-col items-center justify-center bg-neutral-50 px-8 py-10 md:w-52 md:py-14 lg:w-60">
                    <MemberPhoto member={member} displayName={displayName} />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col overflow-y-auto p-7 md:p-8">
                    {/* Identity */}
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-900">{displayName}</h2>
                        <p className="mt-0.5 text-sm text-neutral-500">{member.designation}</p>
                    </div>

                    <hr className="my-5 border-neutral-100" />

                    {/* Bio */}
                    <p className="flex-1 text-[15px] leading-[1.75] text-neutral-600">
                        {member.bio ?? "A valued member of the Haitech Medical family."}
                    </p>

                    {/* Traits */}
                    {cleanTags.length > 0 && (
                        <p className="mt-6 text-xs text-neutral-400">
                            <span className="mr-2 font-medium uppercase tracking-wider text-neutral-300">Known for</span>
                            {cleanTags.join(" · ")}
                        </p>
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
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full md:h-32 md:w-32">
            {member.image && !failed ? (
                <Image
                    src={member.image}
                    alt={member.name}
                    fill={false}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-2xl font-semibold text-neutral-500">
                    {initials}
                </div>
            )}
        </div>
    );
}
