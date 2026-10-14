"use client";

import { useState, useRef } from "react";
import { PrescriptionConfig } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { Paperclip } from "lucide-react";

interface PrescriptionSectionProps {
    config: PrescriptionConfig;
    showPrices?: boolean;
    onFileChange: (file: File | null) => void;
}

export default function PrescriptionSection({ config, showPrices = false, onFileChange }: PrescriptionSectionProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToggle = () => {
        const next = !isEnabled;
        setIsEnabled(next);
        if (!next) {
            setFileName(null);
            onFileChange(null);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file?.name || null);
        onFileChange(file);
    };

    return (
        <div className="space-y-3">
            {/* Header with toggle */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">Add Prescription</h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Required if you need corrective lenses integrated into your loupes.</p>
                    {showPrices && config.corrections && config.corrections.length > 0 && (
                        <>
                            <ul className="mt-2 space-y-0.5 text-[13px] text-neutral-700">
                                {config.corrections.map((c) => (
                                    <li key={c.label} className="tabular-nums">
                                        {c.label}: <span className="font-medium text-neutral-900">{formatPrice(c.price)}</span> <span className="text-neutral-500">extra, incl. GST</span>
                                    </li>
                                ))}
                            </ul>
                            {config.rangeNote && <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{config.rangeNote}</p>}
                        </>
                    )}
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-label="Add Prescription"
                    aria-checked={isEnabled}
                    onClick={handleToggle}
                    className={cn(
                        "focus-visible:outline-primary-500 relative mt-0.5 inline-flex h-8 w-[52px] before:absolute before:-inset-1.5 before:content-[''] shrink-0 items-center rounded-full transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
                        isEnabled ? "bg-primary-700" : "bg-neutral-300"
                    )}
                >
                    <span className={cn("inline-block h-7 w-7 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.25)] transition-transform duration-200 ease-out", isEnabled ? "translate-x-[22px]" : "translate-x-0.5")} />
                </button>
            </div>

            {/* Content - shown when toggled on */}
            {isEnabled && (
                <div className="space-y-3 rounded-xl bg-neutral-50 p-4">
                    {config.disclaimer && <p className="text-[15px] leading-relaxed text-neutral-600">{config.disclaimer}</p>}

                    <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} className="hidden" />

                    <button
                        type="button"
                        onClick={handleFileSelect}
                        className="btn btn-outline btn-md gap-2 bg-white"
                    >
                        <Paperclip className="h-4 w-4" aria-hidden="true" />
                        Attach Document
                    </button>

                    {fileName && <p className="text-primary-800 text-[15px] font-medium">Attached: {fileName}</p>}
                </div>
            )}
        </div>
    );
}
