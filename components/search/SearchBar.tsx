"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar({ initialQuery }: { initialQuery: string }) {
    const [value, setValue] = useState(initialQuery);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-1 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary-300">
            <Search className="h-5 w-5 shrink-0 text-primary-500" />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="flex-1 py-3 text-base text-neutral-900 placeholder:text-neutral-400 outline-none"
                autoComplete="off"
                autoFocus
            />
            <div className="flex items-center gap-2">
                {value && (
                    <button
                        type="button"
                        onClick={() => { setValue(""); inputRef.current?.focus(); }}
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label="Clear"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <button
                    type="submit"
                    className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
