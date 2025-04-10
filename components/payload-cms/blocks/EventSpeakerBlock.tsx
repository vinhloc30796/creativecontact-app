import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type EventSpeakerBlock as EventSpeakerBlockType, type SocialLinks } from "@/payload-types"; // Assuming generated type from payload
import { RichText } from "@/components/payload-cms/RichText";
import { H2, H3, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { getMediaUrl, getMediaAlt } from "@/lib/payload/payloadTypeAdapter";
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Link as LinkIcon,
} from "lucide-react"; // Import icons

interface EventSpeakerBlockProps {
  data: Omit<EventSpeakerBlockType, "id" | "blockType" | "blockName">;
}

// Define explicit type for the layout map
interface LayoutMap {
  standard: string;
  compact: string;
  expanded: string;
}


// Map social platforms to icons
const socialIconMap: Record<string, React.FC<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  website: LinkIcon,
  other: LinkIcon,
};

export const EventSpeakerBlock: React.FC<EventSpeakerBlockProps> = ({
  data,
}) => {
  const { name, role, bio, description, image, socialLinks, layout } = data;

  // Get the layout key, default to 'standard'
  const layoutKey = layout || "standard";

  const imageUrl = getMediaUrl(image);
  const imageAlt = getMediaAlt(image) || name || "Speaker image";

  // Choose description or bio (prioritize rich text description)
  const speakerDescription = description || bio;

  // Container classes based on layout
  const containerLayoutMap: LayoutMap = {
    standard: "gap-6",
    compact: "gap-4 items-center md:flex-row",
    expanded: "gap-6",
  };

  // Safely access the class, falling back to standard if the key is somehow invalid
  const containerClasses = cn(
    "flex flex-col",
    containerLayoutMap[layoutKey as keyof LayoutMap] ||
    containerLayoutMap.standard,
  );

  // Image container classes
  const imageContainerLayoutMap = {
    standard: "w-full aspect-square md:w-1/3",
    compact: "w-20 h-20 md:w-24 md:h-24 rounded-full",
    expanded: "w-full aspect-square md:w-1/2",
  };

  const imageContainerClasses = cn(
    "relative flex-shrink-0 rounded-lg overflow-hidden",
    imageContainerLayoutMap[
    layoutKey as keyof typeof imageContainerLayoutMap
    ] || imageContainerLayoutMap.standard,
  );

  // Text content container classes
  const textContainerLayoutMap = {
    standard: "md:w-2/3",
    compact: "",
    expanded: "md:w-1/2",
  };

  const textContainerClasses = cn(
    textContainerLayoutMap[layoutKey as keyof typeof textContainerLayoutMap] ||
    textContainerLayoutMap.standard,
  );

  return (
    <section
      className={cn(
        "align-left relative flex h-full flex-col justify-end p-5",
        containerClasses,
      )}
    >
      {/* Image */}
      {imageUrl && (
        <div className={imageContainerClasses}>
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
        </div>
      )}

      {/* Text Content */}
      <div className={textContainerClasses}>
        {name && (
          <H3 className="mb-1 text-2xl font-semibold md:text-3xl">{name}</H3>
        )}
        {role && <P className="mb-3 text-lg font-medium">{role}</P>}

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="my-4 flex flex-wrap gap-3">
            {socialLinks.map((link, i: number) => {
              // Use nullish coalescing for platform default
              const platformKey = link.platform ?? "other";
              const Icon = socialIconMap[platformKey];
              // Use label for 'other', otherwise capitalize platformKey (optional)
              const label =
                platformKey === "other"
                  ? link.label
                  : platformKey.charAt(0).toUpperCase() + platformKey.slice(1);

              // Skip rendering if Icon is not found or url is missing
              if (!Icon || !link.url) {
                console.warn(
                  `Skipping social link due to missing Icon or URL:`,
                  link,
                );
                return null;
              }

              return (
                <Link
                  key={link.id || i}
                  href={link.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Link to ${name}'s ${label}`}
                  className="transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        )}

        {/* Description or Bio */}
        {speakerDescription && (
          <div className="prose prose-invert prose-lg">
            {typeof speakerDescription === "object" ? (
              <RichText
                data={speakerDescription}
                className="prose prose-invert prose-lg mx-0 p-0"
              />
            ) : (
              <P className="text-left">{speakerDescription}</P>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventSpeakerBlock;
