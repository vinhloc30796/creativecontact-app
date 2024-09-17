"use client"
import { Badge } from "@/components/ui/badge";
import { Artwork, ArtworkAsset, ArtworkCredit } from "@/drizzle/schema/artwork";
import { UserInfo } from "@/drizzle/schema/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ArtworkCreditWithUser = ArtworkCredit & {
  user: UserInfo
}

export type ArtworkWithAssetsThumbnailCredits = Artwork & {
  assets: ArtworkAsset[];
  thumbnail: {
    filePath: string
  } | null,
  credits: ArtworkCreditWithUser[];
};

interface ArtworkCardProps {
  eventSlug: string;
  artwork: ArtworkWithAssetsThumbnailCredits;
  size: number;
}

// Updated ArtworkCard component with credits
export function ArtworkCard({ eventSlug, artwork, size }: ArtworkCardProps) {
  console.log(artwork);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      style={{ width: `${size}vw`, maxWidth: '600px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {artwork.thumbnail && (
        <>
          <Link href={`/${eventSlug}/artwork/${artwork.id}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${artwork.thumbnail.filePath}`}
              alt={artwork.title}
              width={400}
              height={300}
              objectFit="cover"
              className="w-full h-auto"
            />
          </Link>
          <div
            className={cn(`absolute top-full left-0 right-0 py-4 px-0 transition-opacity duration-300 flex`,
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="w-1/2 text-left pr-2">
              <h3 className="text-xl font-bold text-primary-foreground mb-2">{artwork.title}</h3>
              <time dateTime={artwork.createdAt.toISOString()} className="text-sm text-primary-foreground mb-2 block">
                {artwork.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <p className="text-white text-sm mb-2 line-clamp-3">{artwork.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="text-xs text-primary-foreground">
                  Assets: {artwork.assets.length}
                </Badge>
              </div>
            </div>
            <div className="w-1/2 text-right pl-2">
              <ul className="text-primary-foreground">
                {artwork.credits.map((credit, index) => {
                  // Build credit name from first name, last name, and display name
                  let creditName = credit.user.displayName;
                  if ((!creditName || creditName === '') && (credit.user.firstName || credit.user.lastName)) {
                    creditName = `${credit.user.firstName} ${credit.user.lastName}`;
                  }
                  return (
                    <li key={index}>
                      {creditName || 'Anonymous'}
                      &nbsp;
                      <span className="text-primary-foreground text-xs italic">
                        ({credit.title})
                      </span>
                    </li>
                  )
                })}
              </ul>

            </div>
          </div>
        </>
      )}
    </div>
  );
}