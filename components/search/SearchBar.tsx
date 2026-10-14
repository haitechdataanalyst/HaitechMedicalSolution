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
        <form onSubmit={handleSubmit} role="search"
            className="flex min-h-14 items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-5 shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-200 ease-out focus-within:shadow-[0_0_0_1px_var(--color-primary-500),0_0_0_4px_var(--color-primary-100)]">
            <Search className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search products, brands, categories…"
                aria-label="Search the catalogue"
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-neutral-900 outline-none placeholder:text-neutral-500 md:text-[17px]"
                autoComplete="off"
                autoFocus
            />
            <div className="flex shrink-0 items-center gap-1">
                {value && (
                    <button
                        type="button"
                        onClick={() => { setValue(""); inputRef.current?.focus(); }}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-900/[0.05] hover:text-neutral-900"
                        aria-label="Clear"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-primary-800 hover:bg-primary-900 focus-visible:outline-primary-500 min-h-11 rounded-full px-5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
