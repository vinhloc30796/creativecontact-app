"use client";
import { Badge } from "@/components/ui/badge";
import { Artwork, ArtworkAsset, ArtworkCredit } from "@/drizzle/schema/artwork";
import { UserInfo } from "@/drizzle/schema/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ArtworkCreditWithUser = ArtworkCredit & {
  user: UserInfo;
};

export type ArtworkWithAssetsThumbnailCredits = Artwork & {
  assets: ArtworkAsset[];
  thumbnail: {
    filePath: string;
    assetType: string;
  } | null;
  credits: ArtworkCreditWithUser[];
};

interface ArtworkCardProps {
  eventSlug: string;
  artwork: ArtworkWithAssetsThumbnailCredits;
  size: number;
}

// Updated ArtworkCard component with credits and video support
export function ArtworkCard({ eventSlug, artwork, size }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isVideo = artwork.thumbnail?.assetType?.startsWith("video");
  const assetUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${artwork.thumbnail?.filePath}`;

  return (
    <div
      className="relative w-full max-w-[40vw]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {artwork.thumbnail && (
        <>
          <Link href={`/${eventSlug}/artwork/${artwork.id}`} className="relative block">
            {isVideo ? (
              <video
                src={`${assetUrl}#t=0.05`}
                preload="metadata"
                controls
                className="h-auto w-full"
              />
            ) : (
              <Image
                src={assetUrl}
                alt={artwork.title}
                width={400}
                height={300}
                objectFit="cover"
                className="h-auto w-full"
              />
            )}
            {isHovered && (
              <Badge className="absolute bottom-2 right-2 rounded-[8px] text-xs text-primary-foreground transition-opacity duration-300 bg-primary-1000/80">
                {artwork.assets.length}
              </Badge>
            )}
          </Link>
          <div
            className={cn(
              `absolute left-0 right-0 top-full px-0 py-4 transition-opacity duration-300`,
              "flex flex-col sm:flex-row", // One column by default, two columns on md and above
              "opacity-100", // Always visible,
              isHovered ? "xl:opacity-100" : "xl:opacity-0", // hover effect on xl
            )}
          >
            <div className="mb-4 w-full pr-0 text-left sm:mb-0 sm:w-1/2 sm:pr-2">
              <h3 className="mb-2 text-xl font-bold text-primary-foreground">
                {artwork.title}
              </h3>
              <time
                dateTime={artwork.createdAt.toISOString()}
                className="hidden"
              >
                {artwork.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="w-full pl-0 text-left sm:w-1/2 sm:pl-2 sm:text-right">
              <ul className="text-primary-foreground text-xs sm:text-sm md:text-base">
                {artwork.credits.map((credit, index) => {
                  // Build credit name from first name, last name, and display name
                  let creditName = credit.user.displayName;
                  if (
                    (!creditName || creditName === "") &&
                    (credit.user.firstName || credit.user.lastName)
                  ) {
                    creditName = `${credit.user.firstName} ${credit.user.lastName}`;
                  }
                  return (
                    <li key={index} className="text-xs sm:text-sm md:text-base">
                      {creditName || "Anonymous"}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
