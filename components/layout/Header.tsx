"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { CartButton } from "@/components/cart";
import { MenuIcon } from "@/components/icons";
import Image from "next/image";
import { Button } from "../ui";
import { useHeaderNavigation } from "./NavigationProvider";
import { RocketIcon } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = useHeaderNavigation();

  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-neutral-200">
      <div className="container">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image width={200} height={40} src="/haitech_medical_logo.png" alt="Haitech Medical Logo" />
          </Link>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 md:gap-9">
            <Link href="/support/contact">
              <Button className="px-12 gap-3" variant="solid">
                <RocketIcon size={20} />
                Book a Demo
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1 md:gap-2">
              {/* Cart Button */}
              <CartButton />

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(true)} className="icon-btn md:hidden" aria-label="Open menu">
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu items={navigation} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
