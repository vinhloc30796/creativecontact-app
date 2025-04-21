import React from "react";
import { type Event } from "@/payload-types";
import { H1, H2, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// Extract the specific block type from the Event content union type
type EventCreditsBlockType = Extract<
  Event["content"][number],
  { blockType: "EventCredits" }
>;

interface EventCreditsBlockProps {
  data: Omit<
    EventCreditsBlockType,
    "id" | "blockType" | "blockName" | "layout"
  >;
  /** Hide the main heading H2 element */
  hideHeading?: boolean;
}

export const EventCreditsBlock: React.FC<EventCreditsBlockProps> = ({
  data,
  hideHeading = false,
}) => {
  const { heading, credits } = data;

  if (!credits || credits.length === 0) {
    return null; // Don't render if no credits
  }

  return (
    <section className="flex h-full w-full flex-col overflow-y-auto p-1">
      {!hideHeading && heading && (
        <H1 className="font-bricolage-grotesque text-sunglow mb-5 font-extrabold">
          {heading}
        </H1>
      )}
      <div className="scrollbar-hide grid flex-grow gap-1.5 overflow-y-auto">
        {credits.map((credit, index) => (
          <div
            key={credit.id || index}
            className="flex items-center gap-3 py-1"
          >
            <span className="text-lg font-semibold">{credit.name}</span>
            {credit.roles?.length > 0 && (
              <span className="text-md text-muted-foreground font-normal">
                {credit.roles.map((r) => r.role).join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventCreditsBlock;
