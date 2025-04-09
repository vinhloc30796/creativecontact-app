import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EventSpeaker } from "@/payload-types"; // Assuming generated type from payload
import { RichText } from "@/components/payload-cms/RichText";
import { H2, P } from "@/components/ui/typography";
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
  data: Omit<EventSpeaker, "id" | "blockType" | "blockName">;
}

// Assumed type for social link items based on block definition
interface SocialLink {
  id?: string;
  platform?: "instagram" | "twitter" | "linkedin" | "facebook" | "youtube" | "website" | "other";
  url?: string;
  label?: string;
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

export const EventSpeakerBlock: React.FC<EventSpeakerBlockProps> = ({ data }) => {
  const { name, role, bio, description, image, socialLinks, layout } = data;
  const layoutValue = layout || "standard";
  const imageUrl = getMediaUrl(image);
  const imageAlt = getMediaAlt(image) || name || "Speaker image";

  // Choose description or bio (prioritize rich text description)
  const speakerDescription = description || bio;

  // Container classes based on layout
  const containerLayoutMap = {
    standard: "gap-6 md:flex-row md:gap-8 items-start",
    compact: "gap-4 items-center md:flex-row",
    expanded: "gap-6 items-center", // Similar to standard but might have more spacing/detail
  };
  const containerClasses = cn(
    "flex flex-col",
    containerLayoutMap[layoutValue as keyof typeof containerLayoutMap],
  );

  // Image container classes
  const imageContainerLayoutMap = {
    standard: "w-full aspect-square md:w-1/3",
    compact: "w-20 h-20 md:w-24 md:h-24 rounded-full",
    expanded: "w-full aspect-square md:w-1/2",
  };
  const imageContainerClasses = cn(
    "relative flex-shrink-0 rounded-lg overflow-hidden",
    imageContainerLayoutMap[layoutValue as keyof typeof imageContainerLayoutMap],
  );

  // Text content container classes
  const textContainerLayoutMap = {
    standard: "md:w-2/3",
    compact: "",
    expanded: "md:w-1/2",
  };
  const textContainerClasses = cn(
    "flex-grow",
    textContainerLayoutMap[layoutValue as keyof typeof textContainerLayoutMap],
  );

  return (
    <section className={containerClasses}>
      {/* Image */}
      {imageUrl && (
        <div className={imageContainerClasses}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Text Content */}
      <div className={textContainerClasses}>
        {name && <H2 className="mb-1 text-2xl font-bold">{name}</H2>}
        {role && (
          <P className="mb-3 font-medium text-lg">{role}</P>
        )}

        {/* Description or Bio */}
        {speakerDescription && (
          <div className="prose prose-invert prose-lg mb-4">
            {typeof speakerDescription === "object" ? (
              <RichText data={speakerDescription} />
            ) : (
              <P>{speakerDescription}</P>
            )}
          </div>
        )}

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((link: SocialLink, i: number) => {
              // Use nullish coalescing for platform default
              const platformKey = link.platform ?? "other";
              const Icon = socialIconMap[platformKey];
              // Use label for 'other', otherwise capitalize platformKey (optional)
              const label = platformKey === "other" ? link.label : platformKey.charAt(0).toUpperCase() + platformKey.slice(1);

              // Skip rendering if Icon is not found or url is missing
              if (!Icon || !link.url) {
                console.warn(`Skipping social link due to missing Icon or URL:`, link);
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
      </div>
    </section>
  );
};

export default EventSpeakerBlock; 