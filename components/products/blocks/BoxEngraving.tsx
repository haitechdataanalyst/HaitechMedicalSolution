"use client";

import { useState, useRef, useEffect } from "react";
import { EngravingConfig } from "@/types";
import { cn } from "@/lib/utils";

interface BoxEngravingProps {
    config: EngravingConfig;
    onTextChange: (text: string) => void;
}

export default function BoxEngraving({ config, onTextChange }: BoxEngravingProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [text, setText] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const handleToggle = () => {
        const next = !isEnabled;
        setIsEnabled(next);
        if (!next) {
            setText("");
            onTextChange("");
        }
    };

    const handleTextChange = (value: string) => {
        const capped = config.maxLength ? value.slice(0, config.maxLength) : value;
        setText(capped);
        onTextChange(capped);
    };

    // Pre-load the preview image for canvas drawing
    useEffect(() => {
        const img = new window.Image();
        img.onload = () => {
            imgRef.current = img;
            setImageLoaded(true);
        };
        img.onerror = () => {
            console.error("Failed to load box engraving preview:", config.previewImage);
        };
        img.src = config.previewImage;
    }, [config.previewImage]);

    // Draw text on canvas on the box label area
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageLoaded || !imgRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imgRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw the base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (!text) return;

        // Position text on the white label area of the box
        // The label is typically in the lower-center portion of the case image
        ctx.save();

        const labelCenterX = canvas.width * 0.22;
        const labelCenterY = canvas.height * 0.75;

        // Calculate font size based on text length - shrink for longer text
        const maxFontSize = Math.min(canvas.width * 0.04, 28);
        const minFontSize = 12;
        const fontSize = Math.max(minFontSize, maxFontSize);

        ctx.font = `600 ${Math.round(fontSize)}px "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#1a1a1a";
        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = 1;

        ctx.fillText(text, labelCenterX, labelCenterY);

        ctx.restore();
    }, [text, imageLoaded, isEnabled]);

    return (
        <div className="space-y-3">
            {/* Header with toggle */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">Add a Box Engraving</h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Engrave a custom name or message on your carrying case. No extra charge.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-label="Add a Box Engraving"
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

            {/* Content */}
            {isEnabled && (
                <div className="space-y-3 rounded-xl bg-neutral-50 p-4">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        aria-label="Engraving text"
                        placeholder={config.placeholder || "Your Name"}
                        maxLength={config.maxLength}
                        className="form-input"
                    />

                    {/* Preview */}
                    <div className="relative overflow-hidden rounded-lg">
                        {/* <p className="mb-1 text-xs font-medium text-primary-500">Preview</p> */}
                        <canvas ref={canvasRef} className="h-auto w-full rounded-lg" style={{ display: imageLoaded ? "block" : "none" }} />
                        {!imageLoaded && (
                            <div className="flex h-48 items-center justify-center rounded-lg bg-neutral-100">
                                <p className="text-[13px] text-neutral-500">Loading preview...</p>
                            </div>
                        )}
                    </div>

                    {config.maxLength && (
                        <p className="text-right text-[13px] text-neutral-500 tabular-nums">
                            {text.length}/{config.maxLength}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
