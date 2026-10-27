"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeader from "@/components/misc/SectionHeader";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { OPTION_IDLE, OPTION_SELECTED, OPTION_TILE } from "@/components/products/blocks/option-styles";

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

export function ErgoMagnificationSelector({ embedded = false }: { embedded?: boolean }) {
    const [variantKey, setVariantKey] = useState("ergo-v");
    const [magIdx, setMagIdx] = useState(0);

    const variant = VARIANTS.find((v) => v.key === variantKey)!;
    const mag = variant.mags[magIdx];

    const handleVariantChange = (key: string) => {
        setVariantKey(key);
        setMagIdx(0);
    };

    const content = (
        <>
                <SectionHeader
                    title="Ergo V & V Pro: choose your magnification."
                    subtitle="Higher magnification reveals finer detail — at the cost of a narrower field and shallower depth. Pick the power that fits your procedure."
                />

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
                    {/* Left: controls */}
                    <div className="space-y-8">
                        <div role="group" aria-labelledby="ergo-product-label">
                            <p id="ergo-product-label" className="mb-3 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                                Product
                            </p>
                            {/* Segmented control */}
                            <div className="inline-flex rounded-full bg-neutral-900/[0.05] p-1">
                                {VARIANTS.map((v) => {
                                    const isSelected = variantKey === v.key;
                                    return (
                                        <button
                                            key={v.key}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => handleVariantChange(v.key)}
                                            className={cn(
                                                "focus-visible:outline-primary-500 min-h-11 rounded-full px-5 text-[15px] font-medium transition-[transform,background-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]",
                                                isSelected ? "bg-white text-neutral-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)]" : "text-neutral-600 hover:text-neutral-900"
                                            )}
                                        >
                                            {v.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div role="group" aria-labelledby="ergo-mag-label">
                            <p id="ergo-mag-label" className="mb-3 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                                Magnification
                            </p>
                            <div className="grid max-w-sm grid-cols-3 gap-2.5">
                                {variant.mags.map((m, i) => (
                                    <button key={m.label} type="button" aria-pressed={magIdx === i} onClick={() => setMagIdx(i)} className={cn(OPTION_TILE, "min-h-12", magIdx === i ? OPTION_SELECTED : OPTION_IDLE)}>
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={cn(SURFACE_CARD, "p-2")}>
                            <div className="relative overflow-hidden rounded-xl bg-neutral-50">
                                <Image key={variant.key} src={variant.image} alt={variant.label} width={600} height={400} className="h-auto w-full object-contain p-6 mix-blend-multiply" />
                            </div>
                            <div className="flex items-center justify-between gap-3 px-3 pt-3 pb-2">
                                <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                                    {variant.label}
                                    <span className="ml-2 font-normal text-neutral-500 tabular-nums">{variant.weight}</span>
                                </p>
                                <Link
                                    href={variant.href}
                                    className="group text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 -mr-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[15px] font-medium focus-visible:outline-2"
                                >
                                    View {variant.label} details
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: field-of-view preview + stats */}
                    <div className="flex flex-col items-center gap-10">
                        <figure className="flex flex-col items-center">
                            <div className="relative">
                                <div className="relative h-[260px] w-[260px] overflow-hidden rounded-full bg-neutral-100 shadow-[0_8px_48px_rgba(15,23,42,0.16),0_2px_12px_rgba(15,23,42,0.08)] sm:h-[300px] sm:w-[300px]">
                                    {mag.previewImage ? (
                                        <Image
                                            key={mag.previewImage}
                                            src={mag.previewImage}
                                            alt={`${variant.label} ${mag.label} field of view`}
                                            fill
                                            className="motion-safe:animate-in motion-safe:fade-in object-cover duration-300"
                                            sizes="300px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center">
                                            <p className="text-3xl font-semibold text-neutral-800 tabular-nums">
                                                {mag.fov}
                                                <span className="text-base text-neutral-500">mm</span>
                                            </p>
                                            <p className="text-[13px] text-neutral-500">field of view</p>
                                        </div>
                                    )}
                                </div>
                                <span className="material-popover absolute top-3 -right-2 px-3 py-1.5 text-[13px] font-semibold text-neutral-900 tabular-nums">{mag.label}</span>
                            </div>
                            <figcaption className="mt-5 text-[13px] text-neutral-500">What you see through the loupe</figcaption>
                        </figure>

                        <dl className="grid w-full grid-cols-3 gap-3">
                            {[
                                { label: "Working Distance", value: mag.wd, unit: "mm", note: "customizable" },
                                { label: "Field of View", value: mag.fov, unit: "mm", note: "at WD" },
                                { label: "Depth of Field", value: mag.dof, unit: "mm", note: "at WD" },
                            ].map((stat) => (
                                <div key={stat.label} className={cn(SURFACE_CARD, "flex flex-col-reverse p-4 text-center")}>
                                    <dt className="mt-1 text-[13px] leading-snug text-neutral-500">
                                        {stat.label}
                                        <span className="block text-neutral-500/80">{stat.note}</span>
                                    </dt>
                                    <dd className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900 tabular-nums md:text-3xl">
                                        {stat.value}
                                        <span className="text-[15px] font-medium text-neutral-500">{stat.unit}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <p className="text-center text-[13px] leading-relaxed text-neutral-500">
                            All values measured at {mag.wd}mm working distance. Higher magnification narrows the field and reduces depth of field.
                        </p>
                    </div>
                </div>
        </>
    );

    if (embedded) return <div className="overflow-hidden rounded-3xl bg-neutral-50 p-6 md:p-12 lg:p-16">{content}</div>;

    return (
        <section className="overflow-hidden bg-white">
            <div className="section container">{content}</div>
        </section>
    );
}
