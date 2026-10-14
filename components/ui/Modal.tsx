"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
};

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const titleId = useId();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Move focus into the dialog on open; hand it back to whatever opened it on close.
    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();
        return () => previouslyFocused?.focus?.();
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-80 flex items-end justify-center p-3 sm:items-center sm:p-6">
            {/* Scrim */}
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-200 ease-out starting:opacity-0" onClick={onClose} aria-hidden="true" />

            {/* Sheet */}
            <div
                ref={modalRef}
                className={`relative w-full ${SIZE_CLASSES[size]} flex max-h-[90dvh] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_32px_64px_-24px_rgba(15,23,42,0.35)] transition-[opacity,transform] duration-200 ease-out starting:opacity-0 motion-safe:starting:scale-[0.97]`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 py-3 pr-3 pl-6 sm:pl-8">
                    <h2 id={titleId} className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">
                        {title}
                    </h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900/[0.05] text-neutral-600 transition-colors duration-200 hover:bg-neutral-900/[0.08] hover:text-neutral-900"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-6 pt-2 pb-6 sm:px-8 sm:pb-8">{children}</div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
