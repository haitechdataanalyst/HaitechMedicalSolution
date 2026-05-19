"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

const LOGO_IN_MS   = 380;
const SHUTTER_MS   = 480;
const AUTO_OPEN_MS = 2200;

type Phase = "entering" | "idle" | "opening" | "done";

// useLayoutEffect on client fires synchronously before the browser paints.
// On the server it falls back to useEffect to suppress the SSR warning.
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function SplashScreen() {
    // Start as "entering" so white panels are in the DOM from the very first render —
    // this prevents the page from flashing through before the component mounts.
    const [phase, setPhase]   = useState<Phase>("entering");
    const [logoIn, setLogoIn] = useState(false);
    const rafRef = useRef<number>(0);

    // scroll-lock
    useEffect(() => {
        if (phase === "done") return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        return () => { document.documentElement.style.overflow = prev; };
    }, [phase]);

    // unmount after shutter finishes
    useEffect(() => {
        if (phase !== "opening") return;
        const t = setTimeout(() => setPhase("done"), SHUTTER_MS + 120);
        return () => clearTimeout(t);
    }, [phase]);

    // Runs synchronously before the first paint on the client.
    // Return visits: sets phase → "done" before the browser ever draws the panels.
    // Fresh visits:  panels stay, logo animates in.
    useIsomorphicLayoutEffect(() => {
        if (sessionStorage.getItem("hms_splash")) {
            setPhase("done");
            return;
        }
        sessionStorage.setItem("hms_splash", "1");

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = requestAnimationFrame(() => setLogoIn(true));
        });

        const t1 = setTimeout(() => setPhase(p => p === "entering" ? "idle" : p), LOGO_IN_MS + 80);
        const t2 = setTimeout(() => setPhase(p => p === "idle"     ? "opening" : p), AUTO_OPEN_MS);

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    const open = useCallback(() => {
        setPhase(p => (p === "idle" || p === "entering") ? "opening" : p);
    }, []);

    if (phase === "done") return null;

    const isOpening = phase === "opening";
    const showHint  = phase === "idle";

    return (
        <div
            className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden"
            onClick={open}
            role="button"
            aria-label="Enter site"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
        >
            {/* ── Left shutter panel ── */}
            <div
                className="absolute inset-y-0 left-0 w-1/2 bg-white"
                style={{
                    transform:  isOpening ? "translateX(-101%)" : "translateX(0)",
                    transition: isOpening ? `transform ${SHUTTER_MS}ms cubic-bezier(0.77,0,0.175,1)` : "none",
                    boxShadow:  "3px 0 18px rgba(0,0,0,0.04)",
                    zIndex: 1,
                }}
            />

            {/* ── Right shutter panel ── */}
            <div
                className="absolute inset-y-0 right-0 w-1/2 bg-white"
                style={{
                    transform:  isOpening ? "translateX(101%)" : "translateX(0)",
                    transition: isOpening ? `transform ${SHUTTER_MS}ms cubic-bezier(0.77,0,0.175,1)` : "none",
                    boxShadow:  "-3px 0 18px rgba(0,0,0,0.04)",
                    zIndex: 1,
                }}
            />

            {/* ── Logo layer (above both panels) ── */}
            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 2 }}
            >
                {/* Expanding ping ring — silent tap invitation */}
                {showHint && (
                    <div
                        aria-hidden
                        className="absolute rounded-[40%]"
                        style={{
                            width:     "clamp(240px, 42vw, 500px)",
                            height:    "clamp(80px, 13vw, 160px)",
                            border:    "1.5px solid rgba(31,182,205,0.30)",
                            animation: "splash-ping 2s cubic-bezier(0,0,0.2,1) infinite",
                        }}
                    />
                )}

                {/* Drop-shadow shell */}
                <div style={{ filter: "drop-shadow(0 10px 40px rgba(31,182,205,0.20)) drop-shadow(0 2px 12px rgba(0,0,0,0.07))" }}>
                    {/* Entrance / exit wrapper */}
                    <div
                        style={{
                            opacity:   isOpening ? 0       : logoIn ? 1    : 0,
                            transform: isOpening ? "scale(1.07)" : logoIn ? "scale(1)" : "scale(0.88)",
                            filter:    logoIn    ? "blur(0px)"   : "blur(8px)",
                            transition: isOpening
                                ? `opacity ${Math.round(SHUTTER_MS * 0.45)}ms ease-in, transform ${Math.round(SHUTTER_MS * 0.45)}ms ease-in`
                                : `opacity ${LOGO_IN_MS}ms cubic-bezier(0.16,1,0.3,1), transform ${LOGO_IN_MS}ms cubic-bezier(0.16,1,0.3,1), filter ${LOGO_IN_MS}ms cubic-bezier(0.16,1,0.3,1)`,
                        }}
                    >
                        <Image
                            src="/haitech_medical_logo.png"
                            alt="Haitech Medical Solutions"
                            width={480}
                            height={122}
                            priority
                            className="h-auto w-[200px] sm:w-[280px] md:w-[360px] lg:w-[440px] xl:w-[480px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
