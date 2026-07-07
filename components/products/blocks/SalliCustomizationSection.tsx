"use client";

import { SalliCustomizationConfig } from "@/types";
import { formatPrice } from "@/lib/utils";

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

    return (
        <div className="space-y-5 border-b border-neutral-100 pb-5">
            {config.warrantyText && <p className="text-xs font-medium text-emerald-600">{config.warrantyText}</p>}

            {/* Piston / cylinder height */}
            {config.pistons && config.pistons.length > 0 && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Piston Size</label>
                    <div className="flex flex-wrap gap-2">
                        {config.pistons.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                title={p.description}
                                onClick={() => update({ piston: p.value })}
                                className={`rounded-lg border-2 px-3 py-1.5 text-sm transition-colors ${
                                    selection.piston === p.value ? "border-primary-500 ring-primary-500 ring-2 ring-offset-2" : "border-neutral-300 hover:border-primary-400"
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    {selection.piston && (
                        <p className="mt-1.5 text-xs text-neutral-400">{config.pistons.find((p) => p.value === selection.piston)?.description}</p>
                    )}
                </div>
            )}

            {/* Seat size */}
            {config.seatSizes && config.seatSizes.length > 0 && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Seat Size</label>
                    <div className="flex flex-wrap gap-2">
                        {config.seatSizes.map((s) => (
                            <button
                                key={s.value}
                                type="button"
                                onClick={() => update({ seatSize: s.value })}
                                className={`rounded-lg border-2 px-3 py-1.5 text-sm transition-colors ${
                                    selection.seatSize === s.value ? "border-primary-500 ring-primary-500 ring-2 ring-offset-2" : "border-neutral-300 hover:border-primary-400"
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Upholstery material */}
            {config.materials && config.materials.length > 0 && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Upholstery</label>
                    <div className="flex flex-wrap gap-2">
                        {config.materials.map((m) => (
                            <button
                                key={m.value}
                                type="button"
                                onClick={() => update({ material: m.value })}
                                className={`rounded-lg border-2 px-3 py-1.5 text-sm transition-colors ${
                                    (selection.material ?? config.materials?.[0]?.value) === m.value ? "border-primary-500 ring-primary-500 ring-2 ring-offset-2" : "border-neutral-300 hover:border-primary-400"
                                }`}
                            >
                                {m.label}
                                {typeof m.priceModifier === "number" && m.priceModifier !== 0 && (
                                    <span className="ml-1 text-xs text-neutral-400">
                                        ({m.priceModifier > 0 ? "+" : ""}
                                        {formatPrice(m.priceModifier, currency)})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Compatible accessories */}
            {config.accessories && config.accessories.length > 0 && (
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Add Accessories</label>
                    <div className="space-y-2">
                        {config.accessories.map((a) => {
                            const checked = selection.accessoryIds.includes(a.id);
                            return (
                                <label
                                    key={a.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-3 py-2 text-sm transition-colors ${
                                        checked ? "border-primary-500 bg-primary-50/50" : "border-neutral-200 hover:border-primary-300"
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <input type="checkbox" checked={checked} onChange={() => toggleAccessory(a.id)} className="accent-primary-600 h-4 w-4" />
                                        {a.label}
                                    </span>
                                    <span className="text-xs font-medium text-neutral-500">{a.price > 0 ? `+${formatPrice(a.price, currency)}` : "Price on request"}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
