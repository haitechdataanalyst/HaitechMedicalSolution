"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { CartButton } from "@/components/cart";
import { MenuIcon } from "@/components/icons";
import { NavItem } from "@/types";
import Image from "next/image";
import { Button } from "../ui";

interface HeaderProps {
  navigation: NavItem[];
}

export default function Header({ navigation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-neutral-200">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              width={200}
              height={40}
              src="/haitech_medical_logo.png"
              alt="Haitech Medical Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <Navigation items={navigation} />

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 md:gap-9">
            <Button className="px-12" variant="solid">
              Book a Demo
            </Button>

            <div className="flex items-center justify-center gap-1 md:gap-2">
              {/* Cart Button */}
              <CartButton />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="icon-btn md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        items={navigation}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
