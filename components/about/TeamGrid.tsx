"use client";

import { useState } from "react";
import { TeamMember, TeamMemberData } from "./TeamMember";
import { TeamMemberDialog } from "./TeamMemberDialog";

interface TeamGridProps {
    members: TeamMemberData[];
    title?: string;
    subtitle?: string;
}

export function TeamGrid({ members, title = "Our Team", subtitle = "Meet the dedicated professionals behind Haitech Medical Solutions" }: TeamGridProps) {
    const [activeMember, setActiveMember] = useState<TeamMemberData | null>(null);

    return (
        <section id="team" className="section bg-white">
            <div className="container">
                <div className="mb-8 max-w-2xl md:mb-10">
                    <h2 className="heading-2 text-neutral-900">{title}</h2>
                    <p className="mt-3 text-base leading-relaxed text-neutral-500 md:text-lg">{subtitle}</p>
                </div>

                <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 xl:grid-cols-5">
                    {members.map((member) => (
                        <li key={member.id}>
                            <TeamMember member={member} onClick={() => setActiveMember(member)} />
                        </li>
                    ))}
                </ul>
            </div>

            <TeamMemberDialog member={activeMember} onClose={() => setActiveMember(null)} />
        </section>
    );
}
