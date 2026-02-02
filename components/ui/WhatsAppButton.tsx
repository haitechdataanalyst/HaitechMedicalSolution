"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";

export interface WhatsAppButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
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

const WhatsAppButton = forwardRef<HTMLButtonElement, WhatsAppButtonProps>(
  (
    {
      phoneNumber,
      message,
      size = "md",
      iconOnly = false,
      label = "WhatsApp",
      className,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
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
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
          "bg-[#25D366] text-white hover:bg-[#20BD5A] active:bg-[#1DA851]",
          "focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          iconOnly && "!px-2",
          className
        )}
        {...props}
      >
        <WhatsAppIcon size={iconSizes[size]} />
        {!iconOnly && <span>{label}</span>}
      </button>
    );
  }
);

WhatsAppButton.displayName = "WhatsAppButton";

export default WhatsAppButton;
