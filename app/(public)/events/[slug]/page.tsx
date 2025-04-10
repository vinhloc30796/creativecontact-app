import { H1, H2 } from "@/components/ui/typography";
import { fetchEventBySlug } from "@/lib/payload/fetchEvents";
import { BlockTypes, getMediaUrl } from "@/lib/payload/payloadTypeAdapter";
import { Event } from "@/payload-types"; // Assuming Event type is defined
import { format } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
// --- Component Imports from Homepage --- (Assuming paths are correct)
import { ClientNavMenu } from "@/components/ClientNavMenu";
import { Header } from "@/components/Header";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RenderSingleBlock } from "@/components/payload-cms/RenderSingleBlock";
import { getServerTranslation } from "@/lib/i18n/init-server";

const FloatingActions = ({ currentLang }: { currentLang: string }) => {
  // Assuming getServerTranslation can be used here or lang is passed down
  // const { t } = await getServerTranslation(currentLang, "common"); // Example namespace
  const t = (key: string) => key; // Placeholder translation

  return (
    <div className="fixed right-4 bottom-4 z-20 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      <LanguageSwitcher currentLang={currentLang} />
      <ClientNavMenu
        items={[
          { text: t("aboutCC"), href: "/about" },
          { text: t("contactBook"), href: "/contacts" },
          { text: t("events"), href: "/events" }, // Link back to events list
          // Add other relevant links if needed
        ]}
        menuText={t("menu")} // Get menu text from translations
      />
    </div>
  );
};

// Dynamic metadata based on event
export async function generateMetadata({
  params,
}: {
  params: { slug: string }; // Removed Promise<> wrapper for clarity
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
  params: { slug: string };
  searchParams?: { lang?: string }; // Make searchParams optional
}) {
  const { slug } = await params;
  const lang = searchParams?.lang || "en"; // Get lang from searchParams
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

  // Separate Credits block if it exists
  const creditsBlock = event.content?.find(
    (block) => block.blockType === "EventCredits",
  );
  const mainContentBlocks =
    event.content?.filter((block) => block.blockType !== "EventCredits") || [];

  return (
    <main className="bg-gray relative flex h-screen flex-col overflow-hidden">
      {/* Fixed Header */}
      <Header t={t} />

      {/* Horizontally Scrolling Content Area */}
      <div className="relative z-10 flex h-full my-4 gap-4 overflow-x-auto pl-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* 1. Metadata Card (Fixed Width) */}
        <div className="h-full w-[400px] max-w-screen flex-shrink-0 snap-start bg-black/1">
          <div className="bg-gray/40 flex h-full flex-col justify-between rounded-lg p-6 backdrop-blur-md">
            <div>
              <H1 className="mb-4 font-serif text-4xl md:text-5xl">
                {event.title}
              </H1>
              {/* Placeholder for Credits */}
              {creditsBlock && (
                <div className="mt-6 border-t border-white/20 pt-4">
                  <H2 className="mb-2 text-lg font-semibold">Credits</H2>
                  {/* --- TODO: Implement EventCredits Block Rendering --- */}
                  <pre className="overflow-auto rounded bg-white/10 p-2 text-xs">
                    {JSON.stringify(creditsBlock, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="text-sm">
              <p>{event.location}</p>
              {/* Add other relevant metadata if needed */}
            </div>
          </div>
        </div>

        {/* 2. Dynamic Content Blocks (Horizontal Scroll) */}
        {mainContentBlocks.map((block, index) => (
          <div
            key={block.id || index} // Use block.id if available, otherwise index
            className="h-full aspect-square flex-shrink-0 snap-start bg-black/10 p-5 rounded-xl last:mr-4"
          >
            <div className="bg-gray/40 flex h-full rounded-lg p-6 backdrop-blur-md">
              {/* Use RenderSingleBlock to render the correct component for this block */}
              <RenderSingleBlock block={block as BlockTypes} />
            </div>
          </div>
        ))}
        {/* Empty div for padding at the end */}
      </div>
    </main>
  );
}
