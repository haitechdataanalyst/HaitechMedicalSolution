"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";

export interface WhatsAppButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
    /** WhatsApp phone number (with country code, no spaces or special chars) */
    phoneNumber: string;
    /** Pre-filled message to send (optional) */
    message?: string;
    /** Button size variant */
    size?: "sm" | "md" | "lg";
    /** Show only icon without text */
    iconOnly?: boolean;
    /** Custom button text (default: "WhatsApp") */
    label?: string;
}

const WhatsAppButton = forwardRef<HTMLButtonElement, WhatsAppButtonProps>(({ phoneNumber, message, size = "md", iconOnly = false, label = "WhatsApp", className, ...props }, ref) => {
    const sizes = {
        sm: "min-h-11 px-4 text-sm",
        md: "min-h-12 px-6 text-[15px]",
        lg: "min-h-14 px-8 text-base",
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const handleClick = () => {
        // Remove any non-numeric characters from phone number
        const cleanPhone = phoneNumber.replace(/\D/g, "");

        // Build WhatsApp URL
        let whatsappUrl = `https://wa.me/${cleanPhone}`;

        if (message) {
            whatsappUrl += `?text=${encodeURIComponent(message)}`;
        }

        trackEvent("whatsapp_click", { location: "button" });
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            ref={ref}
            type="button"
            onClick={handleClick}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,transform] duration-200 ease-out motion-safe:active:scale-[0.97]",
                "bg-whatsapp text-white hover:bg-[#20BD5A] active:bg-[#1DA851]",
                "focus-visible:outline-whatsapp focus-visible:outline-2 focus-visible:outline-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                sizes[size],
                iconOnly && "aspect-square !px-0",
                className
            )}
            {...props}
        >
            <WhatsAppIcon size={iconSizes[size]} aria-hidden="true" />
            {!iconOnly && <span>{label}</span>}
        </button>
    );
});

WhatsAppButton.displayName = "WhatsAppButton";

export default WhatsAppButton;
