import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function EventEnded({ eventName }: { eventName: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center backdrop-blur-sm">
      <Card className="min-w-[400px] bg-white">
        <CardHeader
          className="border-b relative w-full aspect-video">
          <Image
            src="/banner.jpg"
            alt="Card background"
            objectFit="cover"
            layout="fill"
          />
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-2">
          <CardTitle>
            The event has ended.
          </CardTitle>
          <p>
            The event {eventName} has ended.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}