"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";

interface RotatingWordProps {
    /** Array of words to rotate through */
    words: string[];
    /** Interval in milliseconds between word changes. Defaults to 2000 ms */
    interval?: number;
    /** Additional class names for styling */
    className?: string;
}

/**
 * RotatingWord – Displays one word at a time from the provided list and
 * rotates through them with a quirky rolodx-style 3D flip animation.
 *
 * Each word change triggers a 3D rotation effect with perspective scaling
 * for a fun, tactile feeling reminiscent of flipping through a rolodex.
 * The container maintains a fixed width based on the longest word to prevent layout shift.
 */
export function RotatingWord({ words, interval = 2000, className }: RotatingWordProps) {
    const [index, setIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

    // Measure the width of the longest word to prevent layout shift
    useLayoutEffect(() => {
        if (!measureRef.current || words.length === 0) return;

        const measurer = measureRef.current;
        let maxWidth = 0;

        // Temporarily measure each word
        words.forEach(word => {
            measurer.textContent = word;
            const width = measurer.getBoundingClientRect().width;
            maxWidth = Math.max(maxWidth, width);
        });

        // Add a small buffer for safety (animations might cause slight size changes)
        setContainerWidth(Math.ceil(maxWidth) + 4);
    }, [words, className]); // Re-measure if words or className changes

    useEffect(() => {
        if (words.length <= 1) return; // Nothing to rotate

        const id = setInterval(() => {
            setIsFlipping(true);

            // After half the animation, change the word
            setTimeout(() => {
                setIndex((prev) => {
                    let next = Math.floor(Math.random() * words.length);
                    // Ensure the next word differs from the current one
                    while (next === prev && words.length > 1) {
                        next = Math.floor(Math.random() * words.length);
                    }
                    return next;
                });
            }, 150); // Half of the 300ms animation

            // Reset flip state after animation completes
            setTimeout(() => {
                setIsFlipping(false);
            }, 300);
        }, interval);

        return () => clearInterval(id);
    }, [words, interval]);

    return (
        <>
            {/* Hidden measurer span - uses same className for accurate measurement */}
            <span
                ref={measureRef}
                className={cn("invisible absolute pointer-events-none", className)}
                aria-hidden="true"
            >
                {/* This will be used for measuring */}
            </span>

            {/* Actual rotating word container */}
            <span
                className={cn(
                    "inline-block transition-all duration-300 ease-out text-center",
                    "transform-gpu", // Use GPU acceleration
                    isFlipping
                        ? "scale-110 -rotate-12 skew-y-6 opacity-80"
                        : "scale-100 rotate-0 skew-y-0 opacity-100",
                    className
                )}
                style={{
                    width: containerWidth ? `${containerWidth}px` : 'auto',
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom",
                }}
            >
                <span
                    className={cn(
                        "inline-block transition-all duration-300 ease-out",
                        isFlipping
                            ? "rotateX-90 scale-75 blur-sm"
                            : "rotateX-0 scale-100 blur-0"
                    )}
                    style={{
                        transform: isFlipping
                            ? "rotateX(90deg) rotateY(15deg) scale(0.75)"
                            : "rotateX(0deg) rotateY(0deg) scale(1)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {words[index]}
                </span>
            </span>
        </>
    );
} 