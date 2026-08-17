"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MAG_IMAGES_BASE = "/images/products/admetec/magnification";

type Mag = {
    label: string;
    fov: number;
    dof: number;
    wd: number;
    previewImage?: string;
};

type Variant = {
    key: string;
    label: string;
    href: string;
    image: string;
    weight: string;
    mags: Mag[];
};

const VARIANTS: Variant[] = [
    {
        key: "ergo-v",
        label: "Ergo V",
        href: "/product/ergo-v",
        image: "/images/products/admetec/Loupes-ErgoV-ErgoV/Blues_Frame/Blues-Black-Ergo-V.jpg",
        weight: "55g",
        mags: [
            { label: "3.8x", fov: 100, dof: 110, wd: 500, previewImage: `${MAG_IMAGES_BASE}/admetec-ergo-v-3.8x-350x350.webp` },
            { label: "5.3x", fov: 75,  dof: 85,  wd: 500, previewImage: `${MAG_IMAGES_BASE}/admetec-ergo-v-5.3x-350x350.webp` },
            { label: "7.0x", fov: 48,  dof: 62,  wd: 500, previewImage: `${MAG_IMAGES_BASE}/admetec-ergo-v-74x-350x350.webp` },
        ],
    },
    {
        key: "ergo-v-pro",
        label: "Ergo V Pro",
        href: "/product/ergo-v-pro",
        image: "/images/products/admetec/Loupes-ErgoV-ErgoVPro/Blues_Frame/Blues-Black-Ergo-V-Pro.jpg",
        weight: "60g",
        mags: [
            { label: "5.6x", fov: 70,  dof: 83,  wd: 500, previewImage: `${MAG_IMAGES_BASE}/admetec-ergo-v-pro-5.6x-350x350.webp` },
            { label: "7.4x", fov: 45,  dof: 58,  wd: 500, previewImage: `${MAG_IMAGES_BASE}/admetec-ergo-v-pro-7.4x-350x350.webp` },
            { label: "10x",  fov: 35,  dof: 43,  wd: 500, previewImage: `${MAG_IMAGES_BASE}/admetec-ergo-v-pro-10x-350x350.webp` },
        ],
    },
];

export function ErgoMagnificationSelector() {
    const [variantKey, setVariantKey] = useState("ergo-v");
    const [magIdx, setMagIdx] = useState(0);

    const variant = VARIANTS.find((v) => v.key === variantKey)!;
    const mag = variant.mags[magIdx];

    const handleVariantChange = (key: string) => {
        setVariantKey(key);
        setMagIdx(0);
    };

    return (
        <section className="overflow-hidden bg-neutral-50 py-16 md:py-20 lg:py-24">
            <div className="container">

                {/* Section header */}
                <div className="mb-10 md:mb-14">
                    <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-500">
                        Variable Magnification
                    </span>
                    <h2 className="text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                        Choose your<br />magnification.
                    </h2>
                    <p className="mt-4 max-w-md text-base text-neutral-600 md:text-lg">
                        Higher magnification reveals finer detail — at the cost of a narrower field and shallower depth. Pick the power that fits your procedure.
                    </p>
                </div>

                {/* Main interactive panel */}
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">

                    {/* ── Left: Controls ── */}
                    <div className="space-y-8">

                        {/* Product variant tabs */}
                        <div>
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Product</p>
                            <div className="inline-flex rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
                                {VARIANTS.map((v) => (
                                    <button
                                        key={v.key}
                                        onClick={() => handleVariantChange(v.key)}
                                        className={
                                            variantKey === v.key
                                                ? "rounded-xl bg-[#AE132A] px-5 py-2 text-sm font-bold text-white shadow-[0_2px_12px_-2px_rgba(174,19,42,0.45)] transition-all duration-200"
                                                : "rounded-xl px-5 py-2 text-sm font-semibold text-neutral-400 transition-all duration-200 hover:text-neutral-700"
                                        }
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Magnification buttons */}
                        <div>
                            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">Magnification</p>
                            <div className="flex flex-wrap gap-3">
                                {variant.mags.map((m, i) => (
                                    <button
                                        key={m.label}
                                        onClick={() => setMagIdx(i)}
                                        className={
                                            magIdx === i
                                                ? "rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3)] transition-all duration-200"
                                                : "rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-500 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:text-neutral-800"
                                        }
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product image */}
                        <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-md">
                            <Image
                                key={variant.key}
                                src={variant.image}
                                alt={variant.label}
                                width={600}
                                height={400}
                                className="h-auto w-full object-contain p-6 transition-opacity duration-300"
                            />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <span className="rounded-full bg-[#AE132A]/8 px-3 py-1 text-xs font-bold text-[#AE132A]">
                                    {variant.label}
                                </span>
                                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-400">
                                    {variant.weight}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href={variant.href}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-600 shadow-sm transition-all hover:border-[#AE132A]/30 hover:bg-[#AE132A]/5 hover:text-[#AE132A]"
                        >
                            View {variant.label} details
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* ── Right: FOV circle + stats ── */}
                    <div className="flex flex-col items-center gap-10 lg:items-start">

                        {/* Circle — fixed size, no border, pure shadow */}
                        <div className="relative flex w-full items-center justify-center py-6">
                            <div
                                className="relative overflow-hidden rounded-full transition-all duration-500 ease-in-out"
                                style={{
                                    width: "280px",
                                    height: "280px",
                                    boxShadow: "0 8px 60px rgba(0,0,0,0.18), 0 2px 16px rgba(0,0,0,0.10)",
                                }}
                            >
                                {mag.previewImage ? (
                                    <Image
                                        key={mag.previewImage}
                                        src={mag.previewImage}
                                        alt={`${variant.label} ${mag.label} field of view`}
                                        fill
                                        className="object-cover transition-opacity duration-300"
                                        sizes="280px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-neutral-600 tabular-nums">
                                                {mag.fov}<span className="text-base font-semibold text-neutral-400">mm</span>
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                                field of view
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Magnification badge — top right of circle */}
                            <div className="absolute right-[calc(50%-160px)] top-4 rounded-full border border-neutral-200 bg-white px-3 py-1.5 shadow-sm">
                                <span className="text-xs font-bold text-neutral-800">{mag.label}</span>
                            </div>

                            {/* Caption */}
                            <p className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                                What you see through the loupe
                            </p>
                        </div>

                        {/* Stat cards */}
                        <div className="grid w-full grid-cols-3 gap-3">
                            {[
                                { label: "Working Distance", value: mag.wd,  unit: "mm", note: "customizable" },
                                { label: "Field of View",    value: mag.fov, unit: "mm", note: "at WD" },
                                { label: "Depth of Field",   value: mag.dof, unit: "mm", note: "at WD" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm"
                                >
                                    <p className="text-2xl font-bold tabular-nums text-neutral-900 md:text-3xl">
                                        {stat.value}
                                        <span className="text-sm font-semibold text-neutral-400">{stat.unit}</span>
                                    </p>
                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                        {stat.label}
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-300">{stat.note}</p>
                                </div>
                            ))}
                        </div>

                        {/* Context note */}
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            All values measured at {mag.wd}mm working distance.
                            Higher magnification narrows the field and reduces depth of field.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
