import { TeamMember, TeamMemberData } from "./TeamMember";

interface TeamGridProps {
  members: TeamMemberData[];
  title?: string;
  subtitle?: string;
}

export function TeamGrid({
  members,
  title = "Our Team",
  subtitle = "Meet the dedicated professionals behind Haitech Medical Solutions",
}: TeamGridProps) {
  return (
    <section id="team" className="section bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="heading-2 text-foreground mb-3">{title}</h2>
          <p className="text-body-lg text-muted max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          {members.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
