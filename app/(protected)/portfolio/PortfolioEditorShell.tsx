"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
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
  const leftScrollRef = useRef<HTMLDivElement | null>(null);
  const rightScrollRef = useRef<HTMLDivElement | null>(null);
  const [leftMaxHeightPx, setLeftMaxHeightPx] = useState<number | null>(null);
  const [rightMaxHeightPx, setRightMaxHeightPx] = useState<number | null>(null);

  useEffect(() => {
    const BOTTOM_GAP_PX = 24;

    const computeAvailableHeight = (el: HTMLElement | null) => {
      if (!el) return null;
      const topOffset = el.getBoundingClientRect().top;
      const viewportH = window.innerHeight;
      return Math.max(0, viewportH - topOffset - BOTTOM_GAP_PX);
    };

    const updateRailHeights = () => {
      setLeftMaxHeightPx(computeAvailableHeight(leftScrollRef.current));
      setRightMaxHeightPx(computeAvailableHeight(rightScrollRef.current));
    };

    updateRailHeights();
    window.addEventListener("resize", updateRailHeights);
    window.addEventListener("orientationchange", updateRailHeights);
    return () => {
      window.removeEventListener("resize", updateRailHeights);
      window.removeEventListener("orientationchange", updateRailHeights);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full rounded-none bg-none shadow-none pb-12 lg:pb-0">
      <div className={cn(
        "min-w-0 flex flex-col bg-[#FCFAF5] border border-[#1A1A1A]"
      )}>
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
        <CardContent
          ref={leftScrollRef}
          style={leftMaxHeightPx != null ? ({ ["--left-rail-h" as any]: `${leftMaxHeightPx}px` } as React.CSSProperties) : undefined}
          className="pt-6 lg:overflow-y-auto lg:max-h-[var(--left-rail-h)] no-scrollbar"
        >
          {children}
        </CardContent>
      </div>

      {rightRail && (
        <aside className={cn(
          "min-w-0 bg-[#FCFAF5] border border-[#1A1A1A] self-start lg:border-l-0",
          // Avoid double-thick seam when stacked on mobile; restore on lg
          "border-t-0 lg:border-t"
        )}>
          <div
            ref={rightScrollRef}
            style={rightMaxHeightPx != null ? ({ ["--right-rail-h" as any]: `${rightMaxHeightPx}px` } as React.CSSProperties) : undefined}
            className="lg:max-h-[var(--right-rail-h)] lg:overflow-y-auto pr-1 no-scrollbar pt-6 pb-6"
          >
            {rightRail}
          </div>
        </aside>
      )}
    </div>
  );
}


