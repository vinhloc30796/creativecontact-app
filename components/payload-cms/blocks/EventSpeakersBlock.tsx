import React from "react";
import { type Event, type Media } from "@/payload-types"; // Keep Media type if needed by speakerData
// import { H2 } from "@/components/ui/typography"; // H2 no longer needed
import { cn } from "@/lib/utils";
// Import the individual speaker block component
import { EventSpeakerBlock } from "./EventSpeakerBlock";

// Extract the specific block type from the Event content union type
type EventSpeakersBlockType = Extract<
  Event["content"][number],
  { blockType: "EventSpeakers" }
>;

interface EventSpeakersBlockProps {
  // Accept the full block data, including id, blockType etc.
  data: EventSpeakersBlockType;
}

export const EventSpeakersBlock: React.FC<EventSpeakersBlockProps> = ({
  data,
}) => {
  // Heading is no longer used here
  const { speakers } = data;

  if (!speakers || speakers.length === 0) {
    return null; // Don't render anything if there are no speakers
  }

  // containerClasses are removed as the wrapping elements are gone.
  // Layout is now determined by the parent component.

  // Directly return the array of EventSpeakerBlock components
  return speakers.map((speaker, index) => {
    // Prepare data for individual EventSpeakerBlock
    const speakerData = {
      name: speaker.name,
      role: speaker.role,
      bio: speaker.bio,
      description: undefined, // Pass undefined as description isn't available per speaker here
      image: speaker.image as Media, // Ensure image type is correct
      socialLinks: speaker.socialLinks,
    };

    // Apply key directly to the EventSpeakerBlock
    return <EventSpeakerBlock key={speaker.id || index} data={speakerData} />;
  });
};

export default EventSpeakersBlock;
