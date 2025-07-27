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

export interface ClientNavMenuProps {
  items: MenuItem[];
  activeIndex?: number;
  activePath?: string;
  menuText: string;
}

export function ClientNavMenu({
  items,
  activeIndex,
  activePath,
  menuText,
}: ClientNavMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Determine active index based on current path if activePath is not provided
  const currentPath = activePath || pathname;
  const activeItemIndex =
    activeIndex !== undefined
      ? activeIndex
      : items.findIndex(
        (item) =>
          currentPath === item.href ||
          currentPath.startsWith(`${item.href}/`),
      );

  return (
    <div className="flex flex-col items-end gap-3 md:flex-row md:items-center">
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
                className={`flex h-auto items-center gap-2 rounded-full border border-black px-4 py-1.5 text-base transition-colors ${variant === "primary"
                  ? "bg-sunglow font-medium text-black hover:bg-yellow-500"
                  : "text-foreground bg-white/50 hover:bg-white/50"
                  }`}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  {item.text}
                  <Square size={16} fill="currentColor" />
                </Link>
              </Button>
            );
          })}
        </>
      )}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex h-auto items-center gap-2 rounded-full border border-black px-4 py-1.5 text-base transition-colors ${activeItemIndex === -1 && isExpanded
          ? "bg-sunglow font-medium text-black hover:bg-yellow-500"
          : "text-foreground bg-white/50 hover:bg-white/50"
          }`}
      >
        {menuText}
        {isExpanded ? (
          <X size={16} />
        ) : (
          <Square size={16} fill="currentColor" />
        )}
      </Button>
    </div>
  );
}
