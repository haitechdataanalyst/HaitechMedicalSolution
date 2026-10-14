"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

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
        <div className="relative shrink-0">
            <select
                value={currentSort}
                onChange={(e) => handleChange(e.target.value)}
                className="focus-visible:ring-primary-500 h-11 cursor-pointer appearance-none rounded-full bg-white pr-10 pl-4 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] transition-shadow duration-200 outline-none hover:ring-neutral-900/[0.14] focus-visible:ring-2"
                aria-label="Sort products"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
        </div>
    );
}
