"use client";

import { SalliCustomizationConfig } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { OPTION_IDLE, OPTION_LABEL, OPTION_SELECTED, OPTION_TILE } from "./option-styles";

export interface SalliSelection {
    piston: string | null;
    material: string | null;
    seatSize: string | null;
    accessoryIds: string[];
}

interface SalliCustomizationSectionProps {
    config: SalliCustomizationConfig;
    selection: SalliSelection;
    onChange: (selection: SalliSelection) => void;
    currency?: string;
}

export default function SalliCustomizationSection({ config, selection, onChange, currency = "INR" }: SalliCustomizationSectionProps) {
    const update = (patch: Partial<SalliSelection>) => onChange({ ...selection, ...patch });

    const toggleAccessory = (id: string) => {
        const next = selection.accessoryIds.includes(id) ? selection.accessoryIds.filter((a) => a !== id) : [...selection.accessoryIds, id];
        update({ accessoryIds: next });
    };

    const chip = (isSelected: boolean) => cn(OPTION_TILE, "px-4", isSelected ? OPTION_SELECTED : OPTION_IDLE);

    return (
        <div className="space-y-7">
            {config.warrantyText && <p className="text-[13px] font-medium text-emerald-700">{config.warrantyText}</p>}

            {/* Piston / cylinder height */}
            {config.pistons && config.pistons.length > 0 && (
                <div role="group" aria-label="Piston Size">
                    <p className={OPTION_LABEL}>Piston Size</p>
                    <div className="flex flex-wrap gap-2.5">
                        {config.pistons.map((p) => (
                            <button key={p.value} type="button" title={p.description} aria-pressed={selection.piston === p.value} onClick={() => update({ piston: p.value })} className={chip(selection.piston === p.value)}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                    {selection.piston && <p className="mt-2 text-[13px] text-neutral-500">{config.pistons.find((p) => p.value === selection.piston)?.description}</p>}
                </div>
            )}

            {/* Seat size */}
            {config.seatSizes && config.seatSizes.length > 0 && (
                <div role="group" aria-label="Seat Size">
                    <p className={OPTION_LABEL}>Seat Size</p>
                    <div className="flex flex-wrap gap-2.5">
                        {config.seatSizes.map((s) => (
                            <button key={s.value} type="button" aria-pressed={selection.seatSize === s.value} onClick={() => update({ seatSize: s.value })} className={chip(selection.seatSize === s.value)}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Upholstery material */}
            {config.materials && config.materials.length > 0 && (
                <div role="group" aria-label="Upholstery">
                    <p className={OPTION_LABEL}>Upholstery</p>
                    <div className="flex flex-wrap gap-2.5">
                        {config.materials.map((m) => {
                            const isSelected = (selection.material ?? config.materials?.[0]?.value) === m.value;
                            return (
                                <button key={m.value} type="button" aria-pressed={isSelected} onClick={() => update({ material: m.value })} className={chip(isSelected)}>
                                    {m.label}
                                    {typeof m.priceModifier === "number" && m.priceModifier !== 0 && (
                                        <span className="ml-1.5 text-[13px] font-normal text-neutral-500 tabular-nums">
                                            ({m.priceModifier > 0 ? "+" : ""}
                                            {formatPrice(m.priceModifier, currency)})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Compatible accessories */}
            {config.accessories && config.accessories.length > 0 && (
                <fieldset>
                    <legend className={OPTION_LABEL}>Add Accessories</legend>
                    <div className="space-y-2.5">
                        {config.accessories.map((a) => {
                            const checked = selection.accessoryIds.includes(a.id);
                            return (
                                <label
                                    key={a.id}
                                    className={cn(
                                        "has-[:focus-visible]:outline-primary-500 flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[15px] transition-[box-shadow,background-color] duration-200 ease-out has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                                        checked ? "bg-primary-50/40 ring-primary-700 ring-2" : "ring-1 ring-neutral-900/10 hover:ring-neutral-900/25"
                                    )}
                                >
                                    <span className="flex items-center gap-3 text-neutral-900">
                                        <input type="checkbox" checked={checked} onChange={() => toggleAccessory(a.id)} className="accent-primary-700 h-[18px] w-[18px] shrink-0" />
                                        {a.label}
                                    </span>
                                    <span className="shrink-0 text-[13px] text-neutral-500 tabular-nums">{a.price > 0 ? `+${formatPrice(a.price, currency)}` : "Price on request"}</span>
                                </label>
                            );
                        })}
                    </div>
                </fieldset>
            )}
        </div>
    );
}
