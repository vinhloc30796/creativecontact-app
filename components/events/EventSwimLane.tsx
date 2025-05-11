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
  // Prefix with app URL if Production because https://github.com/payloadcms/payload/issues/6886
  const prefixedThumbnailUrl = process.env.NODE_ENV === "production" ? `${process.env.NEXT_PUBLIC_APP_URL}${thumbnailUrl || ""}` : thumbnailUrl;
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
  // We alternate between top-bottom for event rows and bottom-top for odd rows
  const isEven = rowIndex % 2 === 0;
  const alignPattern = isEven
    ? (["start", "end", "start", "end"] as const)
    : (["end", "start", "end", "start"] as const);

  return (
    <Link
      href={`/events/${slug}`}
      className="group left-1/2 block w-full cursor-pointer border-t border-black py-8 first:border-t last:border-b hover:bg-white/10 hover:backdrop-blur-sm"
    >
      <div className="grid h-48 grid-cols-5">
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
              <span className="font-bricolage-grotesque group-hover:text-stroke-sunglow text-xl font-bold lg:text-2xl">
                {title}
              </span>
            )}
            {key === "image" && prefixedThumbnailUrl && (
              <div className="relative h-full w-4/5">
                <Image
                  src={prefixedThumbnailUrl}
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
    </Link>
  );
}
