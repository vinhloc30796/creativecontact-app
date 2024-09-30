"use server";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EventFooterProps {
  className?: string;
}

export const EventFooter: React.FC<EventFooterProps> = async ({
  className,
}) => {
  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 w-full bg-primary-1000/80 shadow-md",
        className,
      )}
    >
      <div className="container mx-auto flex w-full items-center justify-between px-4 py-4 text-muted-foreground">
        <div className="text-left">{/* Left section content */}</div>
        <div className="text-center">
          © {new Date().getFullYear()} Creative Contact
        </div>
        <div className="text-right">
          <Link
            href="https://www.facebook.com/creativecontact.vn"
            className="mr-4 font-bold transition-colors duration-300 hover:text-primary-foreground"
          >
            FB
          </Link>
          <Link
            href="https://instagram.com/creativecontact_vn"
            className="font-bold transition-colors duration-300 hover:text-primary-foreground"
          >
            IG
          </Link>
        </div>
      </div>
    </footer>
  );
};
