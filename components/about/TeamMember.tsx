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
    <div className="flex flex-col items-center text-center group">
      {/* Circular Image Container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full overflow-hidden bg-primary-100 ring-4 ring-primary-50 group-hover:ring-primary-200 transition-all duration-300">
        {member.image && !imageError ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-3xl md:text-4xl font-semibold">
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-lg text-neutral-900 mb-1">
        {member.name}
      </h3>

      {/* Designation */}
      <p className="text-sm text-neutral-500">{member.designation}</p>
    </div>
  );
}
