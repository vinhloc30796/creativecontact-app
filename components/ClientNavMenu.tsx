"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Square, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export interface MenuItem {
  text: string;
  href: string;
  variant?: "default" | "primary" | "ghost";
}

interface ClientNavMenuProps {
  items: MenuItem[];
  activeIndex?: number;
  activePath?: string;
  menuText: string;
}

export function ClientNavMenu({ items, activeIndex, activePath, menuText }: ClientNavMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Determine active index based on current path if activePath is not provided
  const currentPath = activePath || pathname;
  const activeItemIndex = activeIndex !== undefined
    ? activeIndex
    : items.findIndex(item => currentPath === item.href || currentPath.startsWith(`${item.href}/`));

  return (
    <div className="flex items-center gap-3">
      {isExpanded && (
        <>
          {items.map((item, index) => {
            const isActive = activeItemIndex === index;
            const variant = item.variant || (isActive ? "primary" : "ghost");

            return (
              <Button
                key={`nav-item-${index}`}
                variant={variant === "primary" ? "default" : "ghost"}
                asChild
                className={`px-4 py-1.5 h-auto rounded-full text-sm transition-colors ${variant === "primary"
                  ? "bg-yellow-400 text-black font-medium hover:bg-yellow-500"
                  : "bg-white/10 text-foreground hover:bg-white/20"
                  }`}
              >
                <Link href={item.href}>
                  {item.text}
                </Link>
              </Button>
            );
          })}
        </>
      )}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-4 py-1.5 h-auto rounded-full text-sm transition-colors flex items-center gap-2 ${activeItemIndex === -1 && isExpanded
          ? "bg-yellow-400 text-black font-medium hover:bg-yellow-500"
          : "bg-white/10 text-foreground hover:bg-white/20"
          }`}
      >
        {menuText}
        {isExpanded ? <X size={16} /> : <Square size={16} fill="currentColor" />}
      </Button>
    </div>
  );
} 