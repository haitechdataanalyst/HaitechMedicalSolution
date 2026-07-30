"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { Lordicon, type IconName } from "@/components/icons";
import { FileText } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const stats: { value: string; label: string; icon: IconName }[] = [
    { value: "6+", label: "Global Brands", icon: "globe" },
    { value: "1000+", label: "Workshops & Conferences Supported", icon: "conference" },
    { value: "30+", label: "Active Partnerships", icon: "users" },
    { value: "15+", label: "Years of Excellence", icon: "award" },
];

export default function WhySection() {
    return (
        <section className="bg-navy-gradient">
            <div className="section-lg container">
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
                            Trusted by dental professionals across India for over a decade of clinical excellence, now expanding our reach globally.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Stats Grid */}
                <div className="mb-14 grid grid-cols-2 gap-4 md:mb-16 md:gap-6 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={index} variant="up" delay={index * 100} threshold={0.06}>
                        <Card tone="dark" hover className="p-6 text-center md:p-8">
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
                        </Card>
                        </ScrollReveal>
                    ))}
                </div>

                {/* CTA */}
                <ScrollReveal variant="up" delay={100}>
                    <div className="text-center">
                        <Link href="/support/contact">
                            <Button
                                size="lg"
                                className="group gap-3 rounded-full px-10 font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                                style={{ boxShadow: "0 8px 32px -4px rgb(31 182 205 / 0.5)" }}
                            >
                                <FileText size={18} />
                                Request a Quote
                            </Button>
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
