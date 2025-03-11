import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ContactPictureMetadata {
  width: number;
  height: number;
  url?: string;
}

export function getContactPictures(count: number): ContactPictureMetadata[] {
  // Generate a list of random dimensions for skeleton contact pictures
  return Array.from({ length: count }, () => ({
    width: Math.floor(Math.random() * 100) + 150, // Random width between 150-250px
    height: Math.floor(Math.random() * 100) + 150, // Random height between 150-250px
    url: Math.random() > 0.5 ? `https://example.com/image/${Math.random().toString(36).substring(2, 8)}` : undefined
  }));
}

interface SkeletonContactPictureProps extends ContactPictureMetadata {
  className?: string;
}

export function SkeletonContactPicture({
  width,
  height,
  url,
  className
}: SkeletonContactPictureProps) {
  return (
    <Card
      className={cn("overflow-hidden", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-lg">In Construction</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {url ? (
          <p className="text-sm text-muted-foreground truncate">
            {url.length > 15 ? `${url.substring(0, 15)}...` : url}
          </p>
        ) : (
          <div className="w-full h-full bg-muted rounded-md" />
        )}
      </CardContent>
    </Card>
  );
}