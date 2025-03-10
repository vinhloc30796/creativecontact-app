import React from "react";

interface EventTickerProps {
    eventName: string;
    tickerText: string;
    repetitions?: number;
}

/**
 * EventTicker component displays a horizontally scrolling ticker with event information
 * 
 * @param eventName - The name of the current event
 * @param tickerText - Additional text to display after the event name
 * @param repetitions - Number of times to repeat the ticker text (default: 4)
 */
export function EventTicker({
    eventName,
    tickerText,
    repetitions = 4,
}: EventTickerProps) {
    return (
        <div className="flex h-[2em] flex-col justify-center gap-y-8 bg-yellow-400">
            <div className="flex w-full animate-marquee whitespace-nowrap">
                {Array(repetitions)
                    .fill(0)
                    .map((_, i) => (
                        <span
                            key={i}
                            className="mx-4 text-base font-medium"
                        >{`${eventName} ${tickerText}`}</span>
                    ))}
            </div>
        </div>
    );
} 