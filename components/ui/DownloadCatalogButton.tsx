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
            sm: "btn-sm",
            md: "btn-md",
            lg: "btn-lg",
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
                className={cn("btn btn-solid", sizes[size], iconOnly && "aspect-square px-0!", className)}
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
