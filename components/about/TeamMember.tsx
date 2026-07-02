"use client";

import Image from "next/image";
import { useState } from "react";

export interface TeamMemberData {
    id: string;
    name: string;
    designation: string;
    image?: string;
    bio?: string;
    tags?: string[];
}

interface TeamMemberProps {
    member: TeamMemberData;
    onClick?: () => void;
}

export function TeamMember({ member, onClick }: TeamMemberProps) {
    const [imageError, setImageError] = useState(false);

    const initials = member.name
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className={`group flex h-full flex-col items-center pt-2 text-center${onClick ? " cursor-pointer" : ""}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
            aria-label={onClick ? `View profile of ${member.name}` : undefined}
        >
            {/* Photo circle */}
            <div className="relative mb-4 h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-48 lg:w-48 flex-none overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-[1.03]">
                {member.image && !imageError ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, (max-width: 1024px) 160px, 192px"
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-4xl font-semibold text-white">
                        {initials}
                    </div>
                )}
            </div>

            {/* Name */}
            <h3 className="mb-1 text-base font-semibold leading-snug text-neutral-800 transition-colors group-hover:text-primary-600">
                {member.name}
            </h3>

            {/* Designation */}
            <p className="text-sm leading-snug text-neutral-400">{member.designation}</p>
        </div>
    );
}
