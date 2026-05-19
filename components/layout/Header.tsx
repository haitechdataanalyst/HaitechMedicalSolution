"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { CartButton } from "@/components/cart";
import { MenuIcon } from "@/components/icons";
import Image from "next/image";
import { Button } from "../ui";
import { useHeaderNavigation } from "./NavigationProvider";
import { RocketIcon, Search, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMac, setIsMac] = useState(false);
    const navigation = useHeaderNavigation();

    useEffect(() => { setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform)); }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const openSearch = useCallback(() => setSearchOpen(true), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);

    return (
        <>
            <header className={cn("sticky top-0 z-50 bg-white transition-all duration-200", scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.08)]" : "shadow-none")}>

                {/* ── Primary bar: Logo + Search + Actions ── */}
                <div className="border-b border-neutral-100 bg-white">
                    <div className="container">
                        <div className="flex h-16 items-center gap-4 md:gap-5">

                            {/* Logo — visually anchors the layout */}
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

                            {/* Search — dominant central action */}
                            <button
                                onClick={openSearch}
                                className="hidden flex-1 items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm transition-all duration-150 hover:border-primary-400 hover:bg-white hover:shadow-sm sm:flex"
                                aria-label="Search products"
                            >
                                <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                                <span className="flex-1 truncate whitespace-nowrap text-left text-neutral-400">
                                    Search products, brands, categories…
                                </span>
                                <kbd className="hidden items-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-400 lg:flex">
                                    {isMac ? "⌘K" : "Ctrl+K"}
                                </kbd>
                            </button>

                            {/* Mobile search icon */}
                            <button
                                onClick={openSearch}
                                className="ml-auto rounded-xl p-2 text-neutral-600 transition-colors hover:bg-neutral-100 sm:hidden"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Right actions */}
                            <div className="flex shrink-0 items-center gap-1">
                                {/* Auth links — desktop */}
                                <div className="hidden items-center gap-0.5 md:flex">
                                    <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-primary-600">
                                        Sign In
                                    </Link>
                                    <Link href="/signup" className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100">
                                        Register
                                    </Link>
                                </div>
                                <div className="mx-1 hidden h-5 w-px bg-neutral-200 md:block" />
                                <Link href="/support/contact" className="hidden md:flex">
                                    <Button
                                        className="gap-2 rounded-full px-5 text-sm font-semibold shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)]"
                                        variant="solid"
                                    >
                                        <RocketIcon size={14} />
                                        Book a Demo
                                    </Button>
                                </Link>
                                <Link
                                    href="/account"
                                    className="hidden items-center justify-center rounded-xl p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-600 md:flex"
                                    aria-label="My Account"
                                    title="My Account"
                                >
                                    <UserCircle size={22} />
                                </Link>
                                <CartButton />
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

                {/* ── Secondary bar: Navigation (desktop only) ── */}
                <div className="hidden border-b border-neutral-100 bg-white md:block">
                    <div className="container">
                        <div className="flex h-10 items-stretch">
                            <Navigation standalone />
                        </div>
                    </div>
                </div>

                <MobileMenu items={navigation} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            </header>

            <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
        </>
    );
}
