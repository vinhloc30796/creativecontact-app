import React from "react";
import { BlockTypes } from "@/lib/payload/payloadTypeAdapter";
import { cn } from "@/lib/utils";

interface SquareWrapperProps {
    block: BlockTypes;
    children: React.ReactNode;
}

// Server component – no "use client" directive
export const SquareWrapper: React.FC<SquareWrapperProps> = ({ block, children }) => {
    const base = "flex-shrink-0 snap-start rounded-xl last:mr-4";

    if (block.blockType === "mediaBlock") {
        // Media blocks keep their native aspect-ratio, we just center them.
        return (
            <div
                className={cn(
                    base,
                    "bg-transparent p-0 w-auto flex items-center justify-center"
                )}
            >
                {children}
            </div>
        );
    }

    // All other blocks get a square ratio with an inner card.
    return (
        <div className={cn(base, "square-wrapper bg-black/10 p-5")}>
            <div className="bg-gray/40 h-full rounded-lg p-6 backdrop-blur-md overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default SquareWrapper; 