"use client"
import { Badge } from "@/components/ui/badge";
import { Artwork, ArtworkAsset } from "@/drizzle/schema/artwork";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ArtworkWithAssetsAndThumbnail = Artwork & {
  assets: ArtworkAsset[];
  thumbnail: {
    filePath: string
  } | null
};

interface ArtworkCardProps {
  artwork: ArtworkWithAssetsAndThumbnail;
  size: number;
}

// New ArtworkCard component
export function ArtworkCard({ artwork, size }: ArtworkCardProps) {
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
          <Link href={`/artworks/${artwork.id}`}>
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
            className={cn(`absolute top-full left-0 right-0 py-4 px-0 transition-opacity duration-300`,
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <h3 className="text-xl font-bold text-primary-foreground mb-2">{artwork.title}</h3>
            <time dateTime={artwork.createdAt.toISOString()} className="text-sm text-primary-foreground mb-2">
              {artwork.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <p className="text-white text-sm mb-2 line-clamp-3">{artwork.description}</p>
            <div className="flex flex-wrap gap-2">
              {artwork.assets.map((asset, assetIndex) => (
                <Badge key={assetIndex} variant="secondary" className="text-xs bg-primary text-primary-foreground">
                  {asset.assetType}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}