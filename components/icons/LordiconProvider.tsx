"use client";

import { Player } from "@lordicon/react";
import { useEffect, useRef, useState } from "react";

// Icon JSON data (we'll load these dynamically)
// Using Lordicon's free icons - these are loaded via CDN
const ICON_URLS = {
  // Navigation & UI
  menu: "https://cdn.lordicon.com/eouimtlu.json",
  close: "https://cdn.lordicon.com/nqtddedc.json",
  chevronDown: "https://cdn.lordicon.com/xcrjfuzb.json",
  chevronRight: "https://cdn.lordicon.com/vduvxizq.json",
  chevronLeft: "https://cdn.lordicon.com/whtfgdfm.json",

  // Cart & Shopping
  cart: "https://cdn.lordicon.com/medamo75.json",
  emptyCart: "https://cdn.lordicon.com/hyhnpiza.json",
  trash: "https://cdn.lordicon.com/skkahier.json",

  // Communication
  phone: "https://cdn.lordicon.com/srsgifqc.json",
  email: "https://cdn.lordicon.com/xtzvywzp.json",
  location: "https://cdn.lordicon.com/surcxhka.json",

  // Status & Feedback
  success: "https://cdn.lordicon.com/oqdmuxru.json",
  checkmark: "https://cdn.lordicon.com/egiwmiit.json",
  loading: "https://cdn.lordicon.com/ktsahwvc.json",

  // Content
  image: "https://cdn.lordicon.com/vixtkkbk.json",
  folder: "https://cdn.lordicon.com/yqzmiobz.json",
  inbox: "https://cdn.lordicon.com/hpivxauj.json",
  arrowBack: "https://cdn.lordicon.com/zmkotitn.json",

  // Stats & Business
  package: "https://cdn.lordicon.com/fihkmkwt.json",
  users: "https://cdn.lordicon.com/bhfjfgqz.json",
  globe: "https://cdn.lordicon.com/osuxyevn.json",
  award: "https://cdn.lordicon.com/yqiuuheo.json",
} as const;

export type IconName = keyof typeof ICON_URLS;

interface LordiconProps {
  icon: IconName;
  size?: number;
  className?: string;
  trigger?: "hover" | "click" | "loop" | "loop-on-hover" | "morph" | "boomerang" | "sequence" | "in" | "none";
  colors?: {
    primary?: string;
    secondary?: string;
  };
  state?: string;
  parentHover?: boolean; // Trigger on parent hover instead of self
  delay?: number; // Delay before animation starts (ms)
}

// Cache for loaded icon data
const iconCache = new Map<string, object>();

export function Lordicon({ icon, size = 24, className = "", trigger = "hover", colors = {}, state, parentHover = false, delay = 0 }: LordiconProps) {
  const playerRef = useRef<Player>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const url = ICON_URLS[icon];
  const cachedData = iconCache.get(url);
  const [iconData, setIconData] = useState<object | null>(cachedData || null);
  const [isLoading, setIsLoading] = useState(!cachedData);

  useEffect(() => {
    // If already cached, no need to fetch
    if (iconCache.has(url)) {
      return;
    }

    // Fetch icon data
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        iconCache.set(url, data);
        setIconData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Lordicon:", err);
        setIsLoading(false);
      });
  }, [url]);

  // Handle triggers
  useEffect(() => {
    if (!playerRef.current || !containerRef.current) return;

    const player = playerRef.current;
    const container = containerRef.current;
    const targetElement = parentHover ? container.closest("button, a") || container.parentElement || container : container;

    const handleHover = () => {
      if (trigger === "hover" || trigger === "loop-on-hover") {
        if (delay > 0) {
          setTimeout(() => player.playFromBeginning(), delay);
        } else {
          player.playFromBeginning();
        }
      }
    };

    const handleClick = () => {
      if (trigger === "click") {
        player.playFromBeginning();
      }
    };

    if (trigger === "loop") {
      player.playFromBeginning();
    } else if (trigger === "in") {
      player.playFromBeginning();
    }

    if ((trigger === "hover" || trigger === "loop-on-hover") && targetElement) {
      targetElement.addEventListener("mouseenter", handleHover);
    }

    if (trigger === "click" && targetElement) {
      targetElement.addEventListener("click", handleClick);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener("mouseenter", handleHover);
        targetElement.removeEventListener("click", handleClick);
      }
    };
  }, [trigger, iconData, parentHover, delay]);

  if (isLoading || !iconData) {
    return <div className={className} style={{ width: size, height: size }} />;
  }

  return (
    <div ref={containerRef} className={className} style={{ width: size, height: size, display: "inline-block" }}>
      <Player
        ref={playerRef}
        icon={iconData}
        size={size}
        colorize={colors.primary}
        state={state}
        onComplete={() => {
          if ((trigger === "loop" || trigger === "loop-on-hover") && playerRef.current) {
            playerRef.current.playFromBeginning();
          }
        }}
      />
    </div>
  );
}

export default Lordicon;
