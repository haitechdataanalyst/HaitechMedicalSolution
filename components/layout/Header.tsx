"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { CartButton } from "@/components/cart";
import { MenuIcon } from "@/components/icons";
import Image from "next/image";
import { Button } from "../ui";
import { useHeaderNavigation } from "./NavigationProvider";
import { FileText, Search, X, UserCircle, ChevronDown, LogOut, LayoutDashboard, ShoppingBag, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearchDropdown, GlobalSearchMobile } from "@/components/search/GlobalSearch";
import { useAuth } from "@/components/auth/AuthProvider";
import { COMMERCE_ENABLED } from "@/lib/config";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [isMac, setIsMac] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigation = useHeaderNavigation();
    const { user, isLoading, logout } = useAuth();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform)); }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ⌘K / Ctrl+K — focus the desktop search input
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
                setSearchOpen(true);
            }
            if (e.key === "Escape" && searchOpen) {
                setSearchOpen(false);
                setQuery("");
                searchInputRef.current?.blur();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [searchOpen]);

    // Close dropdown on click outside the search container
    useEffect(() => {
        if (!searchOpen) return;
        const handler = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [searchOpen]);

    const closeSearch = useCallback(() => {
        setSearchOpen(false);
        setQuery("");
        searchInputRef.current?.blur();
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [userMenuOpen]);

    const handleLogout = async () => {
        setUserMenuOpen(false);
        await logout();
    };

    return (
        <>
            <header className={cn("sticky top-0 z-50 bg-white transition-all duration-200", scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.08)]" : "shadow-none")}>

                {/* ── Primary bar ── */}
                <div className="border-b border-neutral-100 bg-white">
                    <div className="container">
                        <div className="flex h-16 items-center gap-4 md:gap-5">

                            {/* Logo */}
                            <Link href="/" className="shrink-0">
                                <Image
                                    width={180}
                                    height={36}
                                    src="/haitech_medical_logo.png"
                                    alt="Haitech Medical"
                                    priority
                                    className="h-auto w-[140px] md:w-[175px]"
                                />
                            </Link>

                            {/* Desktop search — real input + inline dropdown */}
                            <div
                                ref={searchContainerRef}
                                className="relative hidden flex-1 sm:flex"
                            >
                                <div className={cn(
                                    "flex w-full items-center gap-3 rounded-full border bg-neutral-50 px-4 py-2 text-sm transition-all duration-150",
                                    searchOpen
                                        ? "border-primary-400 bg-white shadow-sm"
                                        : "border-neutral-200 hover:border-primary-300 hover:bg-white hover:shadow-sm"
                                )}>
                                    <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => setSearchOpen(true)}
                                        placeholder="Search products, brands, categories…"
                                        className="flex-1 truncate bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    {searchOpen && query ? (
                                        <button
                                            onClick={() => setQuery("")}
                                            className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                            aria-label="Clear"
                                            tabIndex={-1}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    ) : (
                                        <kbd className="hidden items-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-400 lg:flex">
                                            {isMac ? "⌘K" : "Ctrl+K"}
                                        </kbd>
                                    )}
                                </div>

                                {/* Dropdown anchored below the search bar */}
                                <GlobalSearchDropdown
                                    isOpen={searchOpen}
                                    onClose={closeSearch}
                                    query={query}
                                    onQueryChange={setQuery}
                                />
                            </div>

                            {/* Mobile search icon */}
                            <button
                                onClick={() => setMobileSearchOpen(true)}
                                className="ml-auto rounded-xl p-2 text-neutral-600 transition-colors hover:bg-neutral-100 sm:hidden"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Right actions */}
                            <div className="flex shrink-0 items-center gap-1">
                                {COMMERCE_ENABLED && !isLoading && (
                                    <div className="hidden items-center gap-0.5 md:flex">
                                        {user ? (
                                            /* ── Logged-in user dropdown ── */
                                            <div ref={userMenuRef} className="relative">
                                                <button
                                                    onClick={() => setUserMenuOpen((v) => !v)}
                                                    className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 py-1.5 pl-3 pr-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-300 hover:bg-white"
                                                >
                                                    <UserCircle className="h-4 w-4 text-primary-500" />
                                                    <span className="max-w-[120px] truncate">{user.firstName}</span>
                                                    <ChevronDown className={cn("h-3.5 w-3.5 text-neutral-400 transition-transform", userMenuOpen && "rotate-180")} />
                                                </button>

                                                {userMenuOpen && (
                                                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-neutral-200 bg-white py-1.5 shadow-lg">
                                                        <div className="border-b border-neutral-100 px-4 pb-2.5 pt-2">
                                                            <p className="truncate text-sm font-semibold text-neutral-900">{user.firstName} {user.lastName}</p>
                                                            <p className="truncate text-xs text-neutral-500">{user.email}</p>
                                                        </div>
                                                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600">
                                                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                                                        </Link>
                                                        <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600">
                                                            <ShoppingBag className="h-4 w-4" /> My Orders
                                                        </Link>
                                                        <Link href="/account/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-600">
                                                            <Settings className="h-4 w-4" /> Settings
                                                        </Link>
                                                        <div className="my-1 border-t border-neutral-100" />
                                                        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50">
                                                            <LogOut className="h-4 w-4" /> Sign Out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* ── Guest links ── */
                                            <>
                                                <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-primary-600">
                                                    Sign In
                                                </Link>
                                                <Link href="/register" className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100">
                                                    Register
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                                {COMMERCE_ENABLED && <div className="mx-1 hidden h-5 w-px bg-neutral-200 md:block" />}
                                <Link href="/support/contact" className="hidden md:flex">
                                    <Button className="gap-2 rounded-full px-5 text-sm font-semibold" variant="primary">
                                        <FileText size={14} />
                                        Request a Quote
                                    </Button>
                                </Link>
                                {COMMERCE_ENABLED && <CartButton />}
                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="rounded-xl p-2 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
                                    aria-label="Open menu"
                                >
                                    <MenuIcon size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Nav bar (desktop) ── */}
                <div className="hidden border-b border-neutral-100 bg-white md:block">
                    <div className="container">
                        <div className="flex h-10 items-stretch">
                            <Navigation standalone />
                        </div>
                    </div>
                </div>

                <MobileMenu items={navigation} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            </header>

            {/* Mobile search overlay — full screen */}
            <GlobalSearchMobile isOpen={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
        </>
    );
}
