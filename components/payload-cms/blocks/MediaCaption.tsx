"use client";

import React, { useState, useRef, useEffect } from "react";
import { RichText } from "@/components/payload-cms/RichText";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { type Event } from "@/payload-types";

// Extract the specific block type from the Event content union type
// Note: The blockType is 'mediaBlock' in the payload config
type MediaBlockType = Extract<
    Event["content"][number],
    { blockType: "mediaBlock" }
>;

interface MediaCaptionProps {
    caption: MediaBlockType["mediaBlockFields"]["caption"];
}

export const MediaCaption: React.FC<MediaCaptionProps> = ({ caption }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [captionHeight, setCaptionHeight] = useState<string>("0px");
    const captionRef = useRef<HTMLDivElement>(null);
    const figRef = useRef<HTMLElement>(null);

    // Calculate the smart height for expansion based on the container height
    useEffect(() => {
        if (captionRef.current && figRef.current && caption) {
            const contentHeight = captionRef.current.scrollHeight;
            const container = figRef.current.parentElement as HTMLElement | null;
            const containerHeight = container?.clientHeight ?? 0;
            const smartHeight = Math.min(contentHeight, containerHeight * 0.25);
            setCaptionHeight(`${smartHeight}px`);
        }
    }, [caption]);

    if (!caption) return null;

    return (
        <>
            <figcaption
                ref={figRef}
                className="absolute inset-x-0 bottom-0 z-10 bg-gray-900/60 backdrop-blur-sm rounded-b-lg transition-all duration-300 ease-in-out overflow-hidden"
                style={{ height: isExpanded ? captionHeight : "0px" }}
            >
                <div
                    ref={captionRef}
                    className={cn(
                        "p-4 h-full overflow-y-auto no-scrollbar",
                        "pr-10"
                    )}
                >
                    <RichText
                        data={caption}
                        className="prose prose-sm prose-invert max-w-none text-white [&_*]:!text-white [&_p]:!text-white"
                    />
                </div>
            </figcaption>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute bottom-2 right-2 z-20 p-1 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                aria-label={isExpanded ? "Hide caption" : "Show caption"}
            >
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-white" />
                ) : (
                    <ChevronUp className="h-4 w-4 text-white" />
                )}
            </button>
        </>
    );
};

export default MediaCaption; 