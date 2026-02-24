"use client";

import { useState, useRef, useEffect, useCallback, Children, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

interface ResponsiveConfig {
    slidesToShow: number;
    gap?: number;
}

interface CarouselProps {
    children: ReactNode;
    className?: string;
    slideClassName?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    loop?: boolean;
    slidesToShow?: number;
    gap?: number;
    arrowSize?: "sm" | "md" | "lg";
    arrowVariant?: "default" | "outline" | "ghost";
    /** Responsive breakpoints: { 640: { slidesToShow: 2 }, 1024: { slidesToShow: 4 } } */
    responsive?: Record<number, ResponsiveConfig>;
    /** Remove padding/margin around the carousel track (useful for full-bleed hero carousels) */
    noPadding?: boolean;
    /** Position of dot indicators: 'outside' (below carousel), 'inside' (overlaid at bottom), or 'none' */
    dotsPosition?: "outside" | "inside" | "none";
    /** Content to overlay on top of the carousel (useful for hero sections with floating text) */
    overlayContent?: ReactNode;
    /** Custom class for the dots container */
    dotsClassName?: string;
}

export default function Carousel({
    children,
    className = "",
    slideClassName = "",
    autoPlay = false,
    autoPlayInterval = 5000,
    showArrows = true,
    showDots = true,
    loop = true,
    slidesToShow: defaultSlidesToShow = 1,
    gap: defaultGap = 16,
    arrowSize = "md",
    arrowVariant = "default",
    responsive,
    noPadding = false,
    dotsPosition = "outside",
    overlayContent,
    dotsClassName = "",
}: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [windowWidth, setWindowWidth] = useState(1024); // Always start with default for SSR
    const trackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle initial window width and resize events
    useEffect(() => {
        // Update to actual window width on client after hydration
        const updateWidth = () => setWindowWidth(window.innerWidth);
        updateWidth();

        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Calculate responsive values
    const getResponsiveValues = useCallback(() => {
        if (!responsive) {
            return { slidesToShow: defaultSlidesToShow, gap: defaultGap };
        }

        // Sort breakpoints in descending order
        const breakpoints = Object.keys(responsive)
            .map(Number)
            .sort((a, b) => b - a);

        // Find the first breakpoint that matches
        for (const breakpoint of breakpoints) {
            if (windowWidth >= breakpoint) {
                return {
                    slidesToShow: responsive[breakpoint].slidesToShow,
                    gap: responsive[breakpoint].gap ?? defaultGap,
                };
            }
        }

        return { slidesToShow: defaultSlidesToShow, gap: defaultGap };
    }, [responsive, windowWidth, defaultSlidesToShow, defaultGap]);

    const { slidesToShow, gap } = getResponsiveValues();

    const slides = Children.toArray(children);
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - slidesToShow);

    // Clamp currentIndex to valid range for rendering (avoids setState in effect)
    const effectiveIndex = Math.min(currentIndex, maxIndex);

    // Arrow sizes
    const arrowSizes = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    // Arrow variants
    const arrowVariants = {
        default: "bg-white text-neutral-700 shadow-lg hover:bg-neutral-50 border border-neutral-200",
        outline: "bg-transparent border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-100",
        ghost: "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm",
    };

    const goToSlide = useCallback(
        (index: number) => {
            let newIndex = index;

            if (loop) {
                if (index < 0) {
                    newIndex = maxIndex;
                } else if (index > maxIndex) {
                    newIndex = 0;
                }
            } else {
                newIndex = Math.max(0, Math.min(index, maxIndex));
            }

            setCurrentIndex(newIndex);
        },
        [loop, maxIndex]
    );

    const goToPrevious = useCallback(() => {
        goToSlide(effectiveIndex - 1);
    }, [effectiveIndex, goToSlide]);

    const goToNext = useCallback(() => {
        goToSlide(effectiveIndex + 1);
    }, [effectiveIndex, goToSlide]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay || isHovered || totalSlides <= slidesToShow) return;

        const interval = setInterval(() => {
            goToNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, isHovered, goToNext, totalSlides, slidesToShow]);

    // Get slide width in pixels for drag calculations
    const getSlideWidthPx = useCallback(() => {
        if (!containerRef.current) return 300;
        const containerWidth = containerRef.current.offsetWidth;
        return (containerWidth - gap * (slidesToShow - 1)) / slidesToShow + gap;
    }, [gap, slidesToShow]);

    // Unified drag handlers for both touch and mouse
    const handleDragStart = useCallback((clientX: number) => {
        setIsDragging(true);
        setDragStartX(clientX);
        setDragOffset(0);
    }, []);

    const handleDragMove = useCallback(
        (clientX: number) => {
            if (!isDragging) return;
            const offset = clientX - dragStartX;
            setDragOffset(offset);
        },
        [isDragging, dragStartX]
    );

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;

        const slideWidthPx = getSlideWidthPx();
        const threshold = slideWidthPx * 0.2; // 20% of slide width

        if (Math.abs(dragOffset) > threshold) {
            const slidesToMove = Math.round(Math.abs(dragOffset) / slideWidthPx) || 1;
            if (dragOffset > 0) {
                // Dragged right - go to previous
                goToSlide(effectiveIndex - slidesToMove);
            } else {
                // Dragged left - go to next
                goToSlide(effectiveIndex + slidesToMove);
            }
        }

        setIsDragging(false);
        setDragOffset(0);
    }, [isDragging, dragOffset, getSlideWidthPx, effectiveIndex, goToSlide]);

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleDragMove(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    // Mouse event handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        handleDragMove(e.clientX);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleDragEnd();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            }
        };

        const track = trackRef.current;
        if (track) {
            track.addEventListener("keydown", handleKeyDown);
            return () => track.removeEventListener("keydown", handleKeyDown);
        }
    }, [goToPrevious, goToNext]);

    if (totalSlides === 0) return null;

    const slideWidth = `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`;
    const translateX = `calc(-${effectiveIndex} * (${slideWidth} + ${gap}px) + ${dragOffset}px)`;

    return (
        <div
            className={cn("group relative", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                handleMouseLeave();
            }}
        >
            {/* Track Container - padding/margin trick allows shadows to show while clipping overflow */}
            <div ref={containerRef} className={cn("overflow-x-hidden", !noPadding && "-mx-4 px-4 py-4")}>
                <div
                    ref={trackRef}
                    className={cn("flex", !isDragging && "transition-transform duration-500 ease-out")}
                    style={{
                        transform: `translateX(${translateX})`,
                        gap: `${gap}px`,
                        cursor: isDragging ? "grabbing" : "grab",
                        userSelect: "none",
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    tabIndex={0}
                    role="region"
                    aria-label="Carousel"
                >
                    {slides.map((slide, index) => (
                        <div key={index} className={cn("flex-shrink-0", slideClassName)} style={{ width: slideWidth }} aria-hidden={index < effectiveIndex || index >= effectiveIndex + slidesToShow}>
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && totalSlides > slidesToShow && (
                <>
                    <button
                        onClick={goToPrevious}
                        disabled={!loop && effectiveIndex === 0}
                        className={cn(
                            "absolute top-1/2 left-2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200",
                            "opacity-0 group-hover:opacity-100 focus:opacity-100",
                            "disabled:cursor-not-allowed disabled:opacity-30",
                            arrowSizes[arrowSize],
                            arrowVariants[arrowVariant]
                        )}
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon size={iconSizes[arrowSize]} />
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={!loop && effectiveIndex >= maxIndex}
                        className={cn(
                            "absolute top-1/2 right-2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200",
                            "opacity-0 group-hover:opacity-100 focus:opacity-100",
                            "disabled:cursor-not-allowed disabled:opacity-30",
                            arrowSizes[arrowSize],
                            arrowVariants[arrowVariant]
                        )}
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon size={iconSizes[arrowSize]} />
                    </button>
                </>
            )}

            {/* Overlay Content (for hero sections with floating text/CTAs) */}
            {overlayContent && (
                <div className="pointer-events-none absolute inset-0 z-20">
                    <div className="pointer-events-auto h-full">{overlayContent}</div>
                </div>
            )}

            {/* Dot Indicators */}
            {showDots && dotsPosition !== "none" && totalSlides > slidesToShow && (
                <div className={cn("flex justify-center gap-2", dotsPosition === "outside" && "mt-4", dotsPosition === "inside" && "absolute bottom-6 left-1/2 z-30 -translate-x-1/2", dotsClassName)}>
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "h-2.5 w-2.5 rounded-full transition-all duration-200",
                                index === effectiveIndex
                                    ? dotsPosition === "inside"
                                        ? "w-6 bg-white"
                                        : "bg-primary-600 w-6"
                                    : dotsPosition === "inside"
                                      ? "bg-white/50 hover:bg-white/70"
                                      : "bg-neutral-300 hover:bg-neutral-400"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === effectiveIndex ? "true" : "false"}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Named exports for convenience
export { Carousel };
