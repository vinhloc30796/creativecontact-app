import React from "react";
import { type EventDetailsBlock as EventDetailsBlockType } from "@/payload-types"; // Assuming generated type from payload
import { RichText } from "@/components/payload-cms/RichText";
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/payload/payloadTypeAdapter";
import Image from "next/image";

interface EventDetailsBlockProps {
  // Omit blockType and blockName if they are included in the EventDetails type
  // If EventDetails type from payload-types already excludes them, adjust accordingly
  data: Omit<EventDetailsBlockType, "id" | "blockType" | "blockName">;
}

// Define explicit type for the layout map
interface LayoutMap {
  default: string;
  wide: string;
  fullWidth: string;
}

export const EventDetailsBlock: React.FC<EventDetailsBlockProps> = ({
  data,
}) => {
  // Define the layout map with the explicit type
  const layoutMap: LayoutMap = {
    default: "max-w-prose mx-auto",
    wide: "max-w-4xl mx-auto",
    fullWidth: "w-full",
  };
  // Get the layout key, default to 'default'
  const layoutKey = data.layout || "default";
  // Safely access the class, falling back to default if the key is somehow invalid
  const layoutClasses =
    layoutMap[layoutKey as keyof LayoutMap] || layoutMap.default;

  const backgroundImageUrl = getMediaUrl(data.backgroundImage);

  return (
    <section
      // Apply flex, push content bottom, adjust padding, ensure height
      className={cn(
        "align-left relative flex h-full flex-col justify-end p-5", // Use p-10 for 40px padding approx.
      )}
      style={{
        // Apply background image as inline style if it exists
        // Consider using Tailwind classes if image handling becomes complex
        backgroundImage: backgroundImageUrl
          ? `url('${backgroundImageUrl}')`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Optional overlay for readability if background image exists */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0 bg-black/50"></div>
      )}

      {/* Content container relative to the overlay */}
      <div>
        {data.heading && (
          // Align heading left
          <H3 className="mb-4 text-2xl font-semibold md:text-3xl">
            {data.heading}
          </H3>
        )}
        {/* Pass the rich text data to the RichText component */}
        {data.richText && (
          <RichText
            data={data.richText}
            // Adjust prose styles, removed mx-auto
            className="prose prose-invert prose-lg mx-0 p-0"
          />
        )}
      </div>
    </section>
  );
};

// Default export for lazy loading if needed
export default EventDetailsBlock;
