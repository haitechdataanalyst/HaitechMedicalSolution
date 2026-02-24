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
        <div className="group flex flex-col items-center text-center">
            {/* Circular Image Container */}
            <div className="bg-primary-100 ring-primary-50 group-hover:ring-primary-200 relative mb-4 h-32 w-32 overflow-hidden rounded-full ring-4 transition-all duration-300 md:h-40 md:w-40">
                {member.image && !imageError ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" onError={() => setImageError(true)} />
                ) : (
                    <div className="bg-primary-100 text-primary-600 flex h-full w-full items-center justify-center text-3xl font-semibold md:text-4xl">{initials}</div>
                )}
            </div>

            {/* Name */}
            <h3 className="mb-1 text-lg font-semibold text-neutral-900">{member.name}</h3>

            {/* Designation */}
            <p className="text-sm text-neutral-500">{member.designation}</p>
        </div>
    );
}
