"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Country {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
}

// Comprehensive list of countries with emoji flags
export const countries: Country[] = [
    { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
    { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
    { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
    { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
    { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
    { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
    { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
    { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
    { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
    { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
    { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
    { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
    { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
    { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
    { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
    { code: "TW", name: "Taiwan", dialCode: "+886", flag: "🇹🇼" },
    { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
    { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
    { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
    { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
    { code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
    { code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
    { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
    { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
    { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
    { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
    { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
    { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
    { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
    { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
    { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
    { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
    { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
    { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
    { code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
    { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
    { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
    { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
    { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
    { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
    { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
    { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
    { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
    { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
    { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
    { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
    { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
    { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
    { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
    { code: "LK", name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
    { code: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
    { code: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱" },
];

export interface CountrySelectProps {
    label?: string;
    error?: string;
    value?: string;
    onChange?: (country: Country) => void;
    name?: string;
    required?: boolean;
    placeholder?: string;
}

export default function CountrySelect({ label, error, value, onChange, name, required, placeholder = "Select a country" }: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedCountry = countries.find((c) => c.code === value);

    const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()) || country.code.toLowerCase().includes(search.toLowerCase()));

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (country: Country) => {
        onChange?.(country);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="w-full" ref={containerRef}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={value || ""} />

            {/* Custom dropdown trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn("form-input flex w-full items-center justify-between text-left", error && "form-input-error", !selectedCountry && "text-muted")}
            >
                <span className="flex items-center gap-2">
                    {selectedCountry ? (
                        <>
                            <span className="text-xl">{selectedCountry.flag}</span>
                            <span>{selectedCountry.name}</span>
                        </>
                    ) : (
                        placeholder
                    )}
                </span>
                <ChevronDown className={cn("text-muted h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full max-w-md overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
                    {/* Search */}
                    <div className="border-b border-neutral-100 p-2">
                        <div className="relative">
                            <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search countries..."
                                className="focus:ring-primary-500 w-full rounded-md border border-neutral-200 py-2 pr-3 pl-9 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Country list */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleSelect(country)}
                                    className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-50", value === country.code && "bg-primary-50")}
                                >
                                    <span className="text-xl">{country.flag}</span>
                                    <span className="flex-1">{country.name}</span>
                                    <span className="text-muted text-sm">{country.dialCode}</span>
                                </button>
                            ))
                        ) : (
                            <div className="text-muted px-4 py-8 text-center">No countries found</div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

export { CountrySelect };
