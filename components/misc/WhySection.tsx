"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Lordicon, type IconName } from "@/components/icons";
import { RocketIcon } from "lucide-react";

const stats: { value: string; label: string; icon: IconName }[] = [
  {
    value: "5+",
    label: "Products & Counting",
    icon: "package",
  },
  {
    value: "1000+",
    label: "Supported Workshops & Conferences",
    icon: "users",
  },
  {
    value: "30+",
    label: "Partnerships and Expanding",
    icon: "globe",
  },
  {
    value: "13+",
    label: "Years of Experience",
    icon: "award",
  },
];

export default function WhySection() {
  return (
    <section className="section bg-primary-100 text-white">
      <div className="container">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="heading-2 text-primary-900 mb-2">Why Choose Haitech Medical?</h2>
          <p className="text-body-lg text-primary-900 mx-auto max-w-2xl">Trusted by dental professionals across Australia for over a decade</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-6 md:mb-12 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group rounded-xl p-6 text-center backdrop-blur-sm transition-all">
              <Lordicon icon={stat.icon} size={100} trigger="hover" parentHover colors={{ primary: "#ffffff", secondary: "#ffffff" }} />
              <div className="text-primary-900 mb-1 text-3xl font-bold md:text-4xl">{stat.value}</div>
              <div className="text-primary-900 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/support/contact?demo=true">
            <Button size="lg" className="text-primary-600 bg-white hover:bg-neutral-100 px-20 gap-3">
               <RocketIcon size={20} />
              Book a Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
