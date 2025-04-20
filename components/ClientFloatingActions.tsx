"use client";

import React, { useState, useEffect } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ClientNavMenu, MenuItem } from "@/components/ClientNavMenu";
import { cva } from "class-variance-authority";

interface ClientFloatingActionsProps {
  currentLang: string;
  items: MenuItem[];
  menuText: string;
  /** if true, fades on scroll */
  hideOnScroll?: boolean;
}

// style variants: default = static, hide = fade transition
const floatingActionsStyles = cva(
  "pointer-events-auto flex w-full items-center justify-between",
  {
    variants: {
      variant: {
        default: "",
        hide: "transition-opacity duration-200 ease-linear",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function ClientFloatingActions({
  currentLang,
  items,
  menuText,
  hideOnScroll = false,
}: ClientFloatingActionsProps) {
  const t = (key: string) => key;
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!hideOnScroll) return;
    const el = document.getElementById("event-scroll");
    if (!el) return;
    const handleScroll = () => {
      const left = el.scrollLeft;
      const width = el.clientWidth || 1;
      const multiplier = 0.2;
      // opacity goes from 1→0 as left scroll advances to multiplier * width
      // smaller multiplier = faster fade
      const o = Math.max(0, Math.min(1, 1 - left / (multiplier * width)));
      setOpacity(o);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hideOnScroll]);

  return (
    <div
      style={hideOnScroll ? { opacity } : undefined}
      className={floatingActionsStyles({
        variant: hideOnScroll ? "hide" : "default",
      })}
    >
      <LanguageSwitcher currentLang={currentLang} />
      <ClientNavMenu items={items} menuText={menuText} />
    </div>
  );
}
