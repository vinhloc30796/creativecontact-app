import React from "react";
import Link from "next/link";
import Image from "next/image";

interface EventSwimLaneProps {
  eventId: string | number;
  thumbnailUrl: string;
  title: string;
  date: string;
  attendeeCount: number;
  type: string;
  slug: string;
  rowIndex: number;
}

export default function EventSwimLane({
  eventId,
  thumbnailUrl,
  title,
  date,
  attendeeCount,
  type,
  slug,
  rowIndex,
}: EventSwimLaneProps) {
  // Format date
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // Shuffle metadata slots
  const order = React.useMemo(() => {
    const slots = ["title", "image", "type", "count"] as const;
    const arr = [...slots];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Determine alignment pattern based on row parity
  const isEven = rowIndex % 2 === 0;
  const alignPattern = isEven
    ? (["start", "end", "start", "end"] as const)
    : (["end", "start", "end", "start"] as const);

  return (
    <div className="left-1/2 w-full border-t border-black py-8 first:border-t last:border-b">
      <div className="grid grid-cols-5">
        {/* Date always first, aligned top right */}
        <div className="flex items-start">
          <p className="text-sm uppercase">{formattedDate}</p>
        </div>
        {order.map((key, i) => (
          <div
            key={key}
            className={`flex items-${alignPattern[i]} justify-center`}
          >
            {key === "title" && (
              <Link
                href={`/events/${slug}`}
                className="font-bricolage hover:text-sunglow text-xl font-bold lg:text-2xl"
              >
                {title}
              </Link>
            )}
            {key === "image" && thumbnailUrl && (
              <div className="relative h-24 w-24">
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  fill
                  className="rounded object-cover"
                />
              </div>
            )}
            {key === "type" && (
              <span className="rounded bg-white/10 px-2 py-1 text-xs uppercase">
                {type || "digital gallery"}
              </span>
            )}
            {key === "count" && (
              <p className="text-xs">{attendeeCount} attending</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
