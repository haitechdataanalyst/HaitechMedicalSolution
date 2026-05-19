"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { User, Package, Layers, ImageIcon } from "lucide-react";

type FallbackVariant = "product" | "person" | "brand" | "generic";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
    fallbackVariant?: FallbackVariant;
    containerClassName?: string;
    fallbackClassName?: string;
}

const FALLBACK_CONFIGS: Record<FallbackVariant, { Icon: React.ComponentType<{ className?: string }>; bg: string; iconColor: string }> = {
    product: { Icon: Package,    bg: "bg-neutral-100",     iconColor: "text-neutral-300" },
    person:  { Icon: User,       bg: "bg-neutral-100",     iconColor: "text-neutral-300" },
    brand:   { Icon: Layers,     bg: "bg-neutral-50",      iconColor: "text-neutral-300" },
    generic: { Icon: ImageIcon,  bg: "bg-neutral-100",     iconColor: "text-neutral-300" },
};

export default function SafeImage({ fallbackVariant = "generic", containerClassName, fallbackClassName, className, alt, ...props }: SafeImageProps) {
    const [hasError, setHasError] = useState(false);
    const { Icon, bg, iconColor } = FALLBACK_CONFIGS[fallbackVariant];

    if (hasError) {
        return (
            <div className={cn("flex items-center justify-center", bg, containerClassName, fallbackClassName)}>
                <Icon className={cn("h-1/3 w-1/3 max-h-12 max-w-12 opacity-60", iconColor)} />
            </div>
        );
    }

    return (
        <Image
            {...props}
            alt={alt}
            className={cn(className)}
            onError={() => setHasError(true)}
        />
    );
}
