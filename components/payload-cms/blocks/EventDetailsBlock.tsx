import React from "react";
import { EventDetails } from "@/payload-types"; // Assuming generated type from payload
import { RichText } from "@/components/payload-cms/RichText";
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { getMediaUrl } from "@/lib/payload/payloadTypeAdapter";
import Image from "next/image";

interface EventDetailsBlockProps {
  // Omit blockType and blockName if they are included in the EventDetails type
  // If EventDetails type from payload-types already excludes them, adjust accordingly
  data: Omit<EventDetails, "id" | "blockType" | "blockName">;
}

// Define explicit type for the layout map
interface LayoutMap {
  default: string;
  wide: string;
  fullWidth: string;
}

export const EventDetailsBlock: React.FC<EventDetailsBlockProps> = ({ data }) => {
  // Define the layout map with the explicit type
  const layoutMap: LayoutMap = {
    default: "max-w-prose mx-auto",
    wide: "max-w-4xl mx-auto",
    fullWidth: "w-full",
  };
  // Get the layout key, default to 'default'
  const layoutKey = data.layout || 'default';
  // Safely access the class, falling back to default if the key is somehow invalid
  const layoutClasses = layoutMap[layoutKey as keyof LayoutMap] || layoutMap.default;

  const backgroundImageUrl = getMediaUrl(data.backgroundImage);

  return (
    <section
      className={cn("relative py-8 md:py-12", layoutClasses)}
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
        <div className="absolute inset-0 bg-black/50 z-0"></div>
      )}

      {/* Content container relative to the overlay */}
      <div className="relative z-10">
        {data.heading && (
          <H3 className="mb-4 text-center font-semibold text-2xl md:text-3xl">
            {data.heading}
          </H3>
        )}
        {/* Pass the rich text data to the RichText component */}
        {data.richText && (
          <RichText
            data={data.richText}
            className="prose prose-invert prose-lg mx-auto"
          />
        )}
      </div>
    </section>
  );
};

// Default export for lazy loading if needed
export default EventDetailsBlock; 