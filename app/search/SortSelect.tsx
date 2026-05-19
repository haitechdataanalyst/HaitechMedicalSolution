"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "name-asc", label: "Name: A → Z" },
    { value: "name-desc", label: "Name: Z → A" },
    { value: "category", label: "By Category" },
];

interface SortSelectProps {
    currentSort: string;
    q: string;
    category?: string;
}

export function SortSelect({ currentSort, q, category }: SortSelectProps) {
    const router = useRouter();

    const handleChange = (value: string) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        if (value !== "relevance") params.set("sort", value);
        router.push(`/search${params.toString() ? `?${params}` : ""}`);
    };

    return (
        <div className="flex shrink-0 items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-neutral-400" />
            <select
                value={currentSort}
                onChange={(e) => handleChange(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 outline-none transition-colors focus:border-primary-400 hover:border-neutral-300"
                aria-label="Sort products"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
