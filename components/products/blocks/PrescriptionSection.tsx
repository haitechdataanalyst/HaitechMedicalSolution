"use client";

import { useState, useRef } from "react";
import { PrescriptionConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";

interface PrescriptionSectionProps {
    config: PrescriptionConfig;
    onFileChange: (file: File | null) => void;
}

export default function PrescriptionSection({ config, onFileChange }: PrescriptionSectionProps) {
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
                    <h4 className="text-sm font-semibold text-neutral-800">Add Prescription</h4>
                    <p className="mt-0.5 text-xs text-neutral-500">Required if you need corrective lenses integrated into your loupes.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={handleToggle}
                    className={cn("relative inline-flex h-7 w-12 items-center rounded-full transition-colors", isEnabled ? "bg-primary-500" : "bg-neutral-300")}
                >
                    <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform", isEnabled ? "translate-x-6" : "translate-x-1")} />
                </button>
            </div>

            {/* Content - shown when toggled on */}
            {isEnabled && (
                <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    {config.disclaimer && <p className="text-sm text-neutral-600">{config.disclaimer}</p>}

                    <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} className="hidden" />

                    <button
                        type="button"
                        onClick={handleFileSelect}
                        className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
                    >
                        <Paperclip className="h-4 w-4" />
                        Attach Document
                    </button>

                    {fileName && <p className="text-primary-600 text-sm font-medium">Attached: {fileName}</p>}
                </div>
            )}
        </div>
    );
}
