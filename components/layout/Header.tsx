"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { CartButton } from "@/components/cart";
import { MenuIcon } from "@/components/icons";
import Image from "next/image";
import { useHeaderNavigation } from "./NavigationProvider";
import { FileText, Search, X, UserCircle, ChevronDown, LogOut, LayoutDashboard, ShoppingBag, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearchDropdown, GlobalSearchMobile } from "@/components/search/GlobalSearch";
import { useAuth } from "@/components/auth/AuthProvider";
import { COMMERCE_ENABLED } from "@/lib/config";

const MENU_ROW = "flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-[15px] text-neutral-700 transition-colors hover:bg-neutral-900/[0.05] hover:text-neutral-900";
const ICON_BUTTON = "flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-900/[0.05]";

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

    useEffect(() => {
        setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
    }, []);

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
            <header className={cn("material-bar sticky top-0 z-50 transition-shadow duration-200", scrolled ? "shadow-[0_1px_0_rgba(15,23,42,0.08)]" : "shadow-none")}>
                {/* ── Primary bar ── */}
                <div>
                    <div className="container">
                        <div className="flex h-16 items-center gap-4 md:gap-5">
                            {/* Logo */}
                            <Link href="/" className="shrink-0">
                                <Image width={180} height={36} src="/haitech_medical_logo.png" alt="Haitech Medical" priority className="h-auto w-[140px] md:w-[175px]" />
                            </Link>

                            {/* Desktop nav inline from 1280px — one 64px header row instead of two (106px) */}
                            <div className="hidden self-stretch xl:flex">
                                <Navigation standalone />
                            </div>

                            {/* Desktop search — real input + inline dropdown */}
                            <div ref={searchContainerRef} className="relative hidden flex-1 sm:flex">
                                <div
                                    className={cn(
                                        "flex h-10 w-full items-center gap-2.5 rounded-full px-4 text-sm transition-[background-color,box-shadow] duration-200 ease-out",
                                        searchOpen ? "bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_0_0_4px_var(--color-primary-100)]" : "bg-neutral-900/[0.05] hover:bg-neutral-900/[0.07]"
                                    )}
                                >
                                    <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => setSearchOpen(true)}
                                        placeholder="Search products, brands, categories…"
                                        aria-label="Search the catalogue"
                                        className="flex-1 truncate bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-500"
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
                                        <kbd className="hidden items-center rounded-md bg-white/80 px-1.5 py-0.5 font-sans text-xs font-medium text-neutral-500 shadow-[0_0_0_1px_rgba(15,23,42,0.08)] lg:flex">
                                            {isMac ? "⌘K" : "Ctrl+K"}
                                        </kbd>
                                    )}
                                </div>

                                {/* Dropdown anchored below the search bar */}
                                <GlobalSearchDropdown isOpen={searchOpen} onClose={closeSearch} query={query} onQueryChange={setQuery} />
                            </div>

                            {/* Mobile search icon */}
                            <button onClick={() => setMobileSearchOpen(true)} className={cn("ml-auto sm:hidden", ICON_BUTTON)} aria-label="Search">
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
                                                    aria-expanded={userMenuOpen}
                                                    aria-haspopup="menu"
                                                    className="flex h-10 items-center gap-2 rounded-full bg-neutral-900/[0.05] px-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-900/[0.08]"
                                                >
                                                    <UserCircle className="text-primary-700 h-4 w-4" aria-hidden="true" />
                                                    <span className="max-w-[120px] truncate">{user.firstName}</span>
                                                    <ChevronDown className={cn("h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ease-out", userMenuOpen && "rotate-180")} aria-hidden="true" />
                                                </button>

                                                {userMenuOpen && (
                                                    <div role="menu" className="material-popover animate-popover-in absolute top-full right-0 mt-2 w-60 origin-top-right p-1.5">
                                                        <div className="px-3 pt-2 pb-2.5">
                                                            <p className="truncate text-sm font-semibold text-neutral-900">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            <p className="truncate text-xs text-neutral-500">{user.email}</p>
                                                        </div>
                                                        <Link
                                                            href="/account"
                                                            onClick={() => setUserMenuOpen(false)}
                                                            role="menuitem"
                                                            className={MENU_ROW}
                                                        >
                                                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                                                        </Link>
                                                        <Link
                                                            href="/account/orders"
                                                            onClick={() => setUserMenuOpen(false)}
                                                            role="menuitem"
                                                            className={MENU_ROW}
                                                        >
                                                            <ShoppingBag className="h-4 w-4" /> My Orders
                                                        </Link>
                                                        <Link
                                                            href="/account/settings"
                                                            onClick={() => setUserMenuOpen(false)}
                                                            role="menuitem"
                                                            className={MENU_ROW}
                                                        >
                                                            <Settings className="h-4 w-4" /> Settings
                                                        </Link>
                                                        <div className="mx-3 my-1 h-px bg-neutral-900/[0.06]" />
                                                        <button role="menuitem" onClick={handleLogout} className="flex min-h-10 w-full items-center gap-2.5 rounded-xl px-3 text-[15px] text-red-600 transition-colors hover:bg-red-50">
                                                            <LogOut className="h-4 w-4" /> Sign Out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* ── Guest links ── */
                                            <>
                                                <Link
                                                    href="/login"
                                                    className="flex h-10 items-center rounded-full px-3.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-900/[0.05] hover:text-neutral-900"
                                                >
                                                    Sign In
                                                </Link>
                                                <Link href="/register" className="bg-primary-50 text-primary-800 hover:bg-primary-100 flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors">
                                                    Register
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                                {COMMERCE_ENABLED && <div className="mx-1 hidden h-5 w-px bg-neutral-900/10 md:block" />}
                                <Link
                                    href="/support/contact"
                                    className="bg-primary-800 hover:bg-primary-900 hidden h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 ease-out motion-safe:active:scale-[0.97] md:inline-flex"
                                >
                                    <FileText size={14} aria-hidden="true" />
                                    Request a Quote
                                </Link>
                                {COMMERCE_ENABLED && <CartButton />}
                                <button onClick={() => setMobileMenuOpen(true)} className={cn("md:hidden", ICON_BUTTON)} aria-label="Open menu" aria-expanded={mobileMenuOpen}>
                                    <MenuIcon size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Nav bar (tablet / small laptop) — from 1280px the menu sits in the primary bar ── */}
                <div className="hidden md:block xl:hidden">
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
