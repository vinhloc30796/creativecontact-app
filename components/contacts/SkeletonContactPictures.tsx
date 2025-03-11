"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ConstructionIcon } from "@/components/icons/ConstructionIcon";

interface SkeletonContactPictureProps {
  count?: number;
  className?: string;
}

export function SkeletonContactPictures({
  count = 6,
  className,
}: SkeletonContactPictureProps) {
  const [dimensions, setDimensions] = useState<Array<{ width: number; height: number }>>([]);

  // Generate random dimensions on component mount
  useEffect(() => {
    const newDimensions = Array.from({ length: count }, () => {
      // Random width between 100px and 50vw (capped at 50% of viewport width)
      const width = Math.floor(Math.random() * 300) + 100;

      // Random height between 100px and 33vh (capped at 33% of viewport height)
      const height = Math.floor(Math.random() * 200) + 100;

      return { width, height };
    });

    setDimensions(newDimensions);
  }, [count]);

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {dimensions.map((dim, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-md"
          style={{
            width: `${Math.min(dim.width, window.innerWidth / 2)}px`,
            height: `${Math.min(dim.height, window.innerHeight / 3)}px`,
            maxWidth: "50vw",
            maxHeight: "33vh",
            minWidth: "100px",
            minHeight: "100px"
          }}
        >
          <Skeleton className="w-full h-full" />
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className="bg-yellow-400/80 text-black font-medium flex items-center gap-1 px-2 py-1"
            >
              <ConstructionIcon className="h-3 w-3" />
              <span className="text-xs">In Construction</span>
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
