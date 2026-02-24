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
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-neutral-800">Add a Box Engraving</h4>
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

            {/* Content */}
            {isEnabled && (
                <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder={config.placeholder || "Your Name"}
                        maxLength={config.maxLength}
                        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 transition-colors outline-none focus:ring-1"
                    />

                    {/* Preview */}
                    <div className="relative overflow-hidden rounded-lg">
                        {/* <p className="mb-1 text-xs font-medium text-primary-500">Preview</p> */}
                        <canvas ref={canvasRef} className="h-auto w-full rounded-lg" style={{ display: imageLoaded ? "block" : "none" }} />
                        {!imageLoaded && (
                            <div className="flex h-48 items-center justify-center rounded-lg bg-neutral-100">
                                <p className="text-sm text-neutral-400">Loading preview...</p>
                            </div>
                        )}
                    </div>

                    {config.maxLength && (
                        <p className="text-right text-xs text-neutral-400">
                            {text.length}/{config.maxLength}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
