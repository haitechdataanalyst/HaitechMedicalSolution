"use client";

import Image from "next/image";
import { useState } from "react";

export interface TeamMemberData {
    id: string;
    name: string;
    designation: string;
    image?: string;
}

interface TeamMemberProps {
    member: TeamMemberData;
}

export function TeamMember({ member }: TeamMemberProps) {
    const [imageError, setImageError] = useState(false);

    const initials = member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="group flex flex-col items-center rounded-2xl border border-neutral-100 bg-white p-6 text-center transition-all duration-300 hover:border-primary-100 hover:shadow-lg">
            {/* Circular Image Container */}
            <div className="relative mb-5 h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary-50 transition-all duration-300 group-hover:ring-primary-100 md:h-32 md:w-32">
                {member.image && !imageError ? (
                    <Image src={member.image} alt={member.name} fill sizes="(max-width: 768px) 112px, 128px" className="object-cover" onError={() => setImageError(true)} />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-3xl font-semibold text-white md:text-4xl">{initials}</div>
                )}
            </div>

            {/* Name */}
            <h3 className="mb-1 text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">{member.name}</h3>

            {/* Designation */}
            <p className="text-sm text-neutral-500">{member.designation}</p>
        </div>
    );
}
