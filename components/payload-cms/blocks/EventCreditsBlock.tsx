import React from "react";
import { type Event } from "@/payload-types";
import { H2, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// Extract the specific block type from the Event content union type
type EventCreditsBlockType = Extract<
  Event["content"][number],
  { blockType: "EventCredits" }
>;

interface EventCreditsBlockProps {
  data: Omit<EventCreditsBlockType, "id" | "blockType" | "blockName" | "layout">;
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
        <H2 className="mb-5 font-bricolage-grotesque text-4xl font-extrabold text-sunglow">
          {heading}
        </H2>
      )}
      <div className="grid gap-1.5 flex-grow overflow-y-auto scrollbar-hide">
        {credits.map((credit, index) => (
          <div key={credit.id || index} className="flex items-center gap-3 py-1">
            <span className="text-lg font-semibold">
              {credit.name}
            </span>
            {credit.roles?.length > 0 && (
              <span className="text-md font-normal text-muted-foreground">
                {credit.roles.map(r => r.role).join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventCreditsBlock; 