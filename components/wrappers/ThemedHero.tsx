// File: components/wrappers/ThemedHero.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ThemedHeroProps {
  imageSrc?: string;
  className?: string;
  /** Optional: event slug to switch to an event-specific hero image */
  eventSlug?: string;
  /** Optional: overlay opacity from 0 to 1; falls back to CSS var */
  overlayAlpha?: number;
}

/**
 * ThemedHero: A reusable, theme-aware hero background.
 * - Uses CSS vars and tokens to stay adaptive across themes
 * - Applies a subtle overlay using --hero-overlay-alpha (or prop override)
 */
export function ThemedHero({
  imageSrc = "/banner.jpg",
  className,
  eventSlug,
  overlayAlpha,
}: ThemedHeroProps) {
  const chosenImage = eventSlug
    ? `/${eventSlug}-background.png`
    : imageSrc;

  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url(${chosenImage})`,
    backgroundPosition: "center center",
    // Let CSS var control intensity; allow prop to override if provided
    // We use hsla(var(--background), alpha) for harmonious overlay if needed later
    ["--hero-overlay-alpha" as any]: overlayAlpha ?? undefined,
  };

  return (
    <div
      className={cn(
        "bg-cover bg-no-repeat bg-parallax",
        className
      )}
      style={style}
    />
  );
}
