import { type EventSpeakerBlockProps } from "@/components/payload-cms/blocks/EventSpeakerBlock";
import { H1 } from "@/components/ui/typography";
import { fetchEventBySlug } from "@/lib/payload/fetchEvents";
import {
  BlockTypes,
  getMediaUrl,
  Media,
} from "@/lib/payload/payloadTypeAdapter";
import {
  Event
} from "@/payload-types";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
// --- Component Imports from Homepage --- (Assuming paths are correct)
import { ClientFloatingActions } from "@/components/ClientFloatingActions";
import { Header } from "@/components/Header";
import { RenderSingleBlock } from "@/components/payload-cms/RenderSingleBlock";
import { SquareWrapper } from "@/components/payload-cms/SquareWrapper";
import { EventCreditsBlock } from "@/components/payload-cms/blocks/EventCreditsBlock";
import { getServerTranslation } from "@/lib/i18n/init-server";

// server component

// Dynamic metadata based on event
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // Removed Promise<> wrapper for clarity
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  const mediaUrl = getMediaUrl(event.featuredImage);

  return {
    title: `${event.title} | Creative Contact Events`,
    description: event.summary || "Creative Contact Event",
    openGraph: mediaUrl
      ? {
        images: [{ url: mediaUrl }],
      }
      : undefined,
  };
}

export default async function EventPage({
  params,
  searchParams, // Add searchParams to get language
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>; // Make searchParams optional
}) {
  const { slug } = await params; // Get slug from params
  const lang = (await searchParams)?.lang || "en"; // Get lang from searchParams
  const { t } = await getServerTranslation(lang, "HomePage");
  const event: Event | null = await fetchEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  const eventDate = event.eventDate ? new Date(event.eventDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const formattedDate = eventDate
    ? format(eventDate, "EEEE, MMMM d, yyyy")
    : "Date to be determined";

  const formattedTime = eventDate ? format(eventDate, "h:mm a") : "";

  const formattedEndTime = endDate ? format(endDate, "h:mm a") : "";

  // Format duration if both start and end times are available
  let duration = "";
  if (eventDate && endDate) {
    if (endDate.toDateString() === eventDate.toDateString()) {
      // Same day event
      duration = `${formattedTime} - ${formattedEndTime}`;
    } else {
      // Multi-day event
      duration = `${format(eventDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
    }
  } else if (eventDate) {
    duration = formattedTime;
  }

  const featuredImageUrl = getMediaUrl(event.featuredImage);

  // --- Flatten Content Blocks --- START ---
  // 0. Insert the featured image as the **first** block so it always shows up
  //    before the rest of the content. We reuse the same MediaBlock structure
  //    used elsewhere so RenderBlocks can handle it seamlessly.
  const flatContentBlocks: Array<BlockTypes> = [];

  if (event.featuredImage) {
    flatContentBlocks.push({
      id: "featured-image",
      blockType: "mediaBlock",
      blockName: "Featured Image",
      mediaBlockFields: {
        media: event.featuredImage as Media,
        caption: undefined,
        position: "default",
      },
    } as BlockTypes);
  }

  // Identify the standalone EventCredits block (rendered separately in the sidebar)
  const creditsBlock = event.content?.find(
    (
      block,
    ): block is Extract<BlockTypes, { blockType: "EventCredits" }> =>
      block.blockType === "EventCredits",
  );

  // 1. Process the remaining blocks from the CMS content field
  event.content?.forEach((block, blockIndex) => {
    // Add blockIndex for key generation
    if (block.blockType === "EventCredits") {
      // Skip credits block here, rendered separately
      return;
    } else if (block.blockType === "EventSpeakers") {
      // Flatten speakers into individual items
      block.speakers?.forEach((speaker, speakerIndex) => {
        // Add speakerIndex for key generation
        // Create a pseudo-block matching EventSpeakerBlockProps['data']
        const speakerBlockData: EventSpeakerBlockProps["data"] = {
          name: speaker.name,
          role: speaker.role,
          bio: speaker.bio,
          description: undefined, // OK because EventSpeakerBlockProps makes it optional
          image: speaker.image as Media,
          socialLinks: speaker.socialLinks,
          // layout is determined by EventSpeakerBlock itself or default
        };
        // Need to add back blockType and id for the main map key and RenderSingleBlock switch
        flatContentBlocks.push({
          id: speaker.id || `speaker-${blockIndex}-${speakerIndex}`, // Use indices for more robust key
          blockType: "EventSpeaker", // Add blockType here
          ...speakerBlockData,
        } as BlockTypes); // Cast the final object for the array
      });
    } else if (block.blockType === "EventGallery") {
      // ADDED: Handle EventGalleryBlock
      // Flatten gallery images into individual media blocks
      block.images?.forEach((imgItem, imgIndex) => {
        // Add imgIndex for key generation
        if (!imgItem.image) return; // Skip if image is missing

        // Create a pseudo-block matching the structure expected by RenderSingleBlock for 'mediaBlock'
        const mediaBlockData: Extract<BlockTypes, { blockType: "mediaBlock" }> =
        {
          id: imgItem.id || `gallery-img-${blockIndex}-${imgIndex}`, // Unique ID using indices
          blockType: "mediaBlock",
          blockName: `Gallery Image ${imgIndex + 1}`, // Optional: Add a block name
          // These fields form the 'data' prop for MediaBlock component via RenderSingleBlock
          mediaBlockFields: {
            media: imgItem.image as Media, // Assert Media type
            // Ensure caption is RichText or undefined
            caption:
              typeof imgItem.caption === "object" && imgItem.caption !== null
                ? imgItem.caption
                : undefined,
            position: "default", // Default position for individual items
            // settings: block.settings, // Pass gallery-level settings if applicable/needed
          },
        };
        flatContentBlocks.push(mediaBlockData as BlockTypes); // Add to flattened list
      });
    } else {
      // Add other block types directly
      flatContentBlocks.push(block);
    }
  });
  // --- Flatten Content Blocks --- END ---

  return (
    <main className="bg-gray relative flex h-screen flex-col overflow-hidden">
      {/* Fixed Header */}
      <Header t={t} />

      {/* Horizontally Scrolling Content Area - Note: RenderBlocks now handles the inner scroll container */}
      {/* The outer div here controls the height and relative positioning */}
      <div
        id="event-scroll"
        className="relative z-10 my-4 orientation-flow w-full h-full gap-4 p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* 1. Metadata Card (Fixed Width) */}
        <div className="metadata-card flex-shrink-0 snap-start bg-black/1 px-4">
          {" "}
          {/* Added pl-4 here */}
          <div className="bg-gray/40 flex h-full flex-col justify-between rounded-lg p-6 backdrop-blur-md">
            <div className="flex flex-col items-start justify-between">
              <H1 className="font-bricolage-grotesque mb-4 text-4xl md:text-5xl">
                {event.title}
              </H1>
              <p>{event.location}</p>
            </div>
            <div className="text-sm">
              {/* Add other relevant metadata if needed */}
            </div>
            {/* Render Credits Block - Ensure data prop matches component */}
            {creditsBlock && (
              <div className="mt-6 border-t border-white/20 pt-4">
                <EventCreditsBlock
                  data={creditsBlock} // Pass the full creditsBlock object
                />
              </div>
            )}
          </div>
        </div>
        {/* 2. Use RenderBlocks for dynamic content */}
        {/* RenderBlocks now includes the horizontal scroll container styles */}
        {/* Pass flatContentBlocks to the component */}
        {/* Removed the gap-4 from the outer div as RenderBlocks handles it */}
        {flatContentBlocks.map((block, index) => (
          <SquareWrapper
            key={block.id || `flat-block-${index}`}
            block={block}
          >
            <RenderSingleBlock block={block} />
          </SquareWrapper>
        ))}{" "}
        {/* Pass blocks and allow it to grow */}
      </div>
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-20 -translate-y-1/2 transform px-12">
        <div className="pointer-events-auto">
          <ClientFloatingActions
            hideOnScroll
            currentLang={lang}
            items={[
              { text: t("aboutCC"), href: "/about" },
              { text: t("contactBook"), href: "/contacts" },
              { text: t("event"), href: "/events" },
            ]}
            menuText={t("menu")}
          />
        </div>
      </div>
    </main>
  );
}
