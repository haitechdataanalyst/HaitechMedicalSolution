import { TeamMember, TeamMemberData } from "./TeamMember";

interface TeamGridProps {
    members: TeamMemberData[];
    title?: string;
    subtitle?: string;
}

export function TeamGrid({ members, title = "Our Team", subtitle = "Meet the dedicated professionals behind Haitech Medical Solutions" }: TeamGridProps) {
    return (
        <section id="team" className="section bg-white">
            <div className="container">
                {/* Section Header */}
                <div className="mb-10 text-center md:mb-12">
                    <h2 className="heading-2 text-foreground mb-3">{title}</h2>
                    <p className="text-body-lg text-muted mx-auto max-w-2xl">{subtitle}</p>
                </div>

                {/* Team Grid */}
                <div
                    className="grid justify-center gap-8 md:gap-10"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, max-content))",
                    }}
                >
                    {members.map((member) => (
                        <TeamMember key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
