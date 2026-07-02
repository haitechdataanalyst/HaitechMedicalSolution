"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Lordicon, type IconName } from "@/components/icons";
import { RocketIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stats: { value: string; label: string; icon: IconName }[] = [
    { value: "5+", label: "Global Brands", icon: "globe" },
    { value: "1000+", label: "Workshops & Conferences Supported", icon: "conference" },
    { value: "30+", label: "Partnerships & Expanding", icon: "users" },
    { value: "13+", label: "Years of Excellence", icon: "award" },
];

export default function WhySection() {
    return (
        <section className="relative overflow-hidden bg-navy-gradient">
            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="section-lg container relative">
                {/* Header */}
                <ScrollReveal variant="up">
                    <div className="mb-14 text-center md:mb-16">
                        <span className="label-tag label-tag-white mb-5 inline-flex">
                            Our Track Record
                        </span>
                        <h2 className="heading-1 mb-4 text-white">
                            Why Choose{" "}
                            <span className="text-primary-400">Haitech Medical?</span>
                        </h2>
                        <p className="text-body-lg mx-auto max-w-xl text-navy-200">
                            Trusted by dental professionals across Australia for over a decade of clinical excellence.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Stats Grid */}
                <div className="mb-14 grid grid-cols-2 gap-4 md:mb-16 md:gap-6 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={index} variant="up" delay={index * 100} threshold={0.06}>
                        <div
                            className="relative rounded-2xl border border-white/8 bg-white/5 p-6 text-center backdrop-blur-sm md:p-8"
                        >
                            <div>
                                <div className="mb-3 flex justify-center">
                                    <Lordicon
                                        icon={stat.icon}
                                        size={64}
                                        trigger="hover"
                                        colors={{ primary: "#1fb6cd", secondary: "#33cbdb" }}
                                    />
                                </div>
                                <div className="mb-1.5 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-medium uppercase tracking-widest text-navy-300 md:text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* CTA */}
                <ScrollReveal variant="up" delay={100}>
                    <div className="text-center">
                        <Link href="/support/contact?demo=true">
                            <Button
                                size="lg"
                                className="group gap-3 rounded-full bg-primary-500 px-10 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-400"
                                style={{ boxShadow: "0 8px 32px -4px rgb(31 182 205 / 0.5)" }}
                            >
                                <RocketIcon size={18} />
                                Book a Demo
                            </Button>
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
