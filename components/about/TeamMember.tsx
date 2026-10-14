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

function getInitials(name: string): string {
    return name
        .split(" ")
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/** Portrait tile: a consistent 4:5 frame, name and role underneath. Becomes a button when it opens a profile. */
export function TeamMember({ member, onClick }: TeamMemberProps) {
    const [imageError, setImageError] = useState(false);

    const content = (
        <>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100">
                {member.image && !imageError ? (
                    <Image
                        src={member.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 240px"
                        className="object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.02]"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="bg-primary-50 text-primary-800 flex h-full w-full items-center justify-center text-3xl font-semibold">{getInitials(member.name)}</div>
                )}
            </div>
            <h3 className="mt-3 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900 md:text-base">{member.name}</h3>
            <p className="mt-0.5 text-[13px] leading-snug text-neutral-500">{member.designation}</p>
        </>
    );

    if (!onClick) {
        return <div className="flex h-full flex-col text-left">{content}</div>;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`View profile of ${member.name}`}
            className="group focus-visible:outline-primary-500 flex h-full w-full flex-col rounded-2xl text-left transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 motion-safe:active:scale-[0.985] motion-safe:active:duration-100"
        >
            {content}
        </button>
    );
}
