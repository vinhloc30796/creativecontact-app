"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Square, X } from "lucide-react";
import { useState } from "react";

interface ClientNavMenuProps {
  aboutText: string;
  contactBookText: string;
  eventText: string;
  menuText: string;
}

export function ClientNavMenu({ aboutText, contactBookText, eventText, menuText }: ClientNavMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {isExpanded && (
        <>
          <Button
            variant="ghost"
            asChild
            className="bg-white/10 px-4 py-1.5 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
          >
            <Link href="/about">
              {aboutText}
            </Link>
          </Button>
          <Button
            asChild
            className="bg-yellow-400 px-4 py-1.5 h-auto rounded-full text-sm text-black font-medium hover:bg-yellow-500 transition-colors"
          >
            <Link href="/contacts">
              {contactBookText}
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="bg-white/10 px-4 py-1.5 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
          >
            <Link href="/events">
              {eventText}
            </Link>
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white/10 px-4 py-1.5 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors flex items-center gap-2"
      >
        {menuText}
        {isExpanded ? <X size={16} /> : <Square size={16} fill="currentColor" />}
      </Button>
    </div>
  );
} 