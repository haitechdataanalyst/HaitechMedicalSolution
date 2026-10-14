"use client";

import { useState, useRef, useEffect } from "react";
import { EngravingConfig } from "@/types";
import { cn } from "@/lib/utils";

interface TempleTipEngravingProps {
    config: EngravingConfig;
    onTextChange: (text: string) => void;
}

export default function TempleTipEngraving({ config, onTextChange }: TempleTipEngravingProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [text, setText] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
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
            console.error("Failed to load temple tip engraving preview:", config.previewImage);
        };
        img.src = config.previewImage;
    }, [config.previewImage]);

    // Draw text on canvas with perspective effect on the temple tip
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageLoaded || !imgRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imgRef.current;

        // Set canvas to image natural size
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw the base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (!text) return;

        // Temple tip engraving: text along the arm of the spectacle
        // The temple arm typically runs from the right area, slightly angled
        ctx.save();

        // Position text on the temple arm area
        // These values position text on the top-right temple arm area
        const startX = canvas.width * 0.5;
        const startY = canvas.height * 0.38;
        const angle = 0; // slight downward tilt to follow temple arm
        const planeSkewY = -0.48;
        const planeSkewX = 0;
        const planeScaleY = 2;

        ctx.translate(startX, startY);
        ctx.rotate(angle);
        // Fake a z-axis tilt by skewing and compressing the text plane.
        ctx.transform(1, planeSkewY, planeSkewX, planeScaleY, 0, 0);

        // Draw each character with progressively decreasing size for 3D perspective
        const baseFontSize = Math.max(14, Math.min(canvas.width * 0.035, 28));
        let currentX = 0;

        for (let i = 0; i < text.length; i++) {
            const progress = i / 25;
            // Scale decreases towards the end (perspective/vanishing effect)
            const scale = 1 - progress * 0.3;
            const fontSize = baseFontSize * scale;
            const opacity = 1 - progress * 0.2;

            ctx.save();
            ctx.font = `${Math.round(fontSize)}px "Segoe UI", Arial, sans-serif`;
            ctx.fillStyle = `rgba(200, 180, 150, ${opacity})`;
            ctx.shadowColor = "rgba(0,0,0,0.2)";
            ctx.shadowBlur = 1;
            ctx.textBaseline = "middle";

            // Slight vertical drift for 3D depth
            const yDrift = progress * 3;
            ctx.fillText(text[i], currentX, yDrift);

            const charWidth = ctx.measureText(text[i]).width;
            currentX += charWidth * 1; // slightly tighter spacing as it goes
            ctx.restore();
        }

        ctx.restore();
    }, [text, imageLoaded, isEnabled]);

    return (
        <div className="space-y-3">
            {/* Header with toggle */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">Add a Temple Tip Engraving</h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Personalise with your name or initials on the temple arm. No extra charge.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-label="Add a Temple Tip Engraving"
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
                    <div ref={containerRef} className="relative overflow-hidden rounded-lg">
                        {/* <p className="text-primary-500 mb-1 text-xs font-medium">Preview</p> */}
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
