"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { CloudDownload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DownloadCatalogButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: "sm" | "md" | "lg";
    iconOnly?: boolean;
    label?: string;
    fileUrl: string;
    fileName?: string;
}

const DownloadCatalogButton = forwardRef<HTMLButtonElement, DownloadCatalogButtonProps>(
    ({ size = "md", iconOnly = false, label = "Download", fileUrl, fileName, className, onClick, ...props }, ref) => {
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

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            const link = document.createElement("a");
            link.href = fileUrl;
            if (fileName) {
                link.download = fileName;
            } else {
                const segments = fileUrl.split("/");
                link.download = segments[segments.length - 1] || "catalog.pdf";
            }
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onClick?.(event);
        };

        return (
            <button
                ref={ref}
                type="button"
                onClick={handleClick}
                className={cn("btn btn-solid inline-flex items-center justify-center gap-2 rounded-lg transition-colors", sizes[size], iconOnly && "px-2!", className)}
                {...props}
            >
                <CloudDownload size={iconSizes[size]} aria-hidden="true" />
                {!iconOnly && <span>{label}</span>}
            </button>
        );
    }
);

DownloadCatalogButton.displayName = "DownloadCatalogButton";

export default DownloadCatalogButton;
