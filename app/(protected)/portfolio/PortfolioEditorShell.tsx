"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeaderSticky, CardHeaderStickyRow, CardTitle } from "@/components/ui/card";

interface PortfolioEditorShellProps {
  title: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  children: ReactNode; // left/main content under the header
  rightRail?: ReactNode; // optional right column content
  titleClassName?: string;
  actionsClassName?: string;
}

export function PortfolioEditorShell({
  title,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  children,
  rightRail,
  titleClassName,
  actionsClassName,
}: PortfolioEditorShellProps) {
  return (
    <div className="w-full rounded-none bg-[#FCFAF5] border border-[#1A1A1A] shadow-none">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <div className="min-w-0">
          <CardHeaderSticky className="pr-0 py-0">
            <CardHeaderStickyRow className="h-12">
              <CardTitle className={titleClassName}>{title}</CardTitle>
              <div className={cn("flex items-stretch h-full", actionsClassName)}>
                <Button
                  type="button"
                  onClick={onPrimary}
                  className="rounded-none h-full border-l border-[#1A1A1A] text-[#1A1A1A] font-sans font-extrabold text-base leading-[1.26] tracking-[0.02em] uppercase bg-[#FCFAF5] hover:bg-sunglow hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunglow focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFAF5]"
                >
                  {primaryLabel}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSecondary}
                  className="rounded-none h-full border-l border-[#1A1A1A] text-[#1A1A1A] font-sans font-extrabold text-base leading-[1.26] tracking-[0.02em] uppercase bg-[#FCFAF5] hover:bg-sunglow hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunglow focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFAF5]"
                >
                  {secondaryLabel}
                </Button>
              </div>
            </CardHeaderStickyRow>
          </CardHeaderSticky>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </div>

        {rightRail && (
          <aside className="min-w-0 border-l border-[#1A1A1A]">
            <div className="sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              {rightRail}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}


