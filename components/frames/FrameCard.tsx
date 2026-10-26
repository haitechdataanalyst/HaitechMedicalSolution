"use client";

import { useState } from "react";
import Image from "next/image";
import { Frame } from "@/types";
import { cn } from "@/lib/utils";

function ColorSwatch({ hex, name, isSelected, onClick }: { hex: string | string[]; name: string; isSelected: boolean; onClick: () => void }) {
    const isGradient = Array.isArray(hex);

    const style = isGradient ? { background: `linear-gradient(135deg, ${hex[0]} 50%, ${hex[1]} 50%)` } : { backgroundColor: hex };

    // 44px hit area around a 32px swatch; the selected ring sits outside the swatch with a white gap. It reacts on the press itself.
    return (
        <button
            type="button"
            aria-pressed={isSelected}
            aria-label={name}
            title={name}
            onClick={onClick}
            className="focus-visible:outline-primary-500 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 ease-out focus-visible:outline-2 active:scale-[0.9] motion-reduce:transition-none"
        >
            <span
                className={cn(
                    "h-8 w-8 rounded-full ring-offset-2 ring-offset-neutral-50 transition-shadow duration-200",
                    isSelected ? "ring-primary-600 ring-2" : "ring-1 ring-neutral-900/[0.15] ring-offset-0"
                )}
                style={style}
            />
        </button>
    );
}

/**
 * One frame family: a large photo on a tinted tile and its colours as swatches. Choosing a colour cross-fades to that
 * colour's photo. A colour's photo is requested only the first time it is chosen, and the previous one stays on screen
 * until the new one has loaded, so the tile never goes blank.
 */
export function FrameCard({ frame, priority = false }: { frame: Frame; priority?: boolean }) {
    const [selected, setSelected] = useState(0);
    const [previous, setPrevious] = useState(0);
    const [requested, setRequested] = useState<number[]>([0]);
    const [loaded, setLoaded] = useState<number[]>([]);

    // Show the chosen colour once its photo is ready; until then keep the one that was showing.
    const shown = loaded.includes(selected) ? selected : previous;
    const shownColor = frame.colors[shown];
    const selectedColor = frame.colors[selected];

    const choose = (index: number) => {
        if (index === selected) return;
        setPrevious(shown);
        setSelected(index);
        setRequested((list) => (list.includes(index) ? list : [...list, index]));
    };

    return (
        <article className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-neutral-900/[0.04]">
            <div className="relative aspect-[4/3] w-full">
                {requested.map((index) => {
                    const color = frame.colors[index];
                    const isShown = index === shown;
                    return (
                        <Image
                            key={color.id}
                            src={color.image || frame.image}
                            alt={isShown ? `${frame.name} frame in ${color.name}` : ""}
                            aria-hidden={!isShown}
                            fill
                            priority={priority && index === 0}
                            onLoad={() => setLoaded((list) => (list.includes(index) ? list : [...list, index]))}
                            className={cn(
                                "object-contain p-8 mix-blend-multiply transition-opacity duration-300 ease-out motion-reduce:transition-none md:p-12",
                                isShown ? "opacity-100" : "opacity-0"
                            )}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    );
                })}
            </div>

            <div className="flex flex-1 flex-col items-center px-6 pt-2 pb-8 text-center">
                <h3 className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900">{frame.name}</h3>
                <p className="mt-1.5 text-[15px] text-neutral-500" aria-live="polite">
                    {selectedColor?.name ?? shownColor?.name}
                </p>
                <div role="group" aria-label={`${frame.name} colours`} className="mt-3 flex flex-wrap justify-center gap-1">
                    {frame.colors.map((color, index) => (
                        <ColorSwatch key={color.id} hex={color.hex} name={color.name} isSelected={index === selected} onClick={() => choose(index)} />
                    ))}
                </div>
            </div>
        </article>
    );
}
