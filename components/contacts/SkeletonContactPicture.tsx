import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    url:
      Math.random() > 0.5
        ? `https://example.com/image/${Math.random().toString(36).substring(2, 8)}`
        : undefined,
  }));
}

interface SkeletonContactPictureProps extends ContactPictureMetadata {
  className?: string;
}

export function SkeletonContactPicture({
  width,
  height,
  url,
  className,
}: SkeletonContactPictureProps) {
  return (
    <Card
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <CardHeader className="flex-shrink-0 bg-yellow-400 p-4">
        <CardTitle className="text-lg">In Construction</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4 pt-4">
        <div className="relative h-full">
          <p
            className="line-clamp-none text-sm text-muted-foreground"
            style={{
              lineHeight: "1.5em",
              height: "100%",
              overflow: "hidden",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
          <div
            className="absolute bottom-0 left-0 h-[1.5em] w-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%)",
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-shrink-0 p-4 pt-0">
        <Link
          href={
            url ||
            `https://example.com/contact/${Math.random().toString(36).substring(2, 8)}`
          }
          className="text-xs text-blue-500 hover:underline"
        >
          {url
            ? url.length > 20
              ? `${url.substring(0, 20)}...`
              : url
            : "View contact details"}
        </Link>
      </CardFooter>
    </Card>
  );
}
