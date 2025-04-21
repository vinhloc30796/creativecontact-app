"use client";
import Link from "next/link";
import { EventTicker } from "@/components/events/EventTicker";
import { Button } from "@/components/ui/button";

export function FooterCTA() {
  return (
    <div className="my-12 w-full text-center">
      <div className="flex flex-col space-y-1.5 p-6">
        <EventTicker
          eventName=""
          tickerText="do you want to collaborate?  do you want to be our next event host?  do you have an idea?"
          variant="no-bg"
          speed={60}
          textClassName="font-bricolage-grotesque text-4xl font-extrabold"
        />
      </div>
      <div className="flex items-center justify-center p-6 pt-0">
        <Button
          asChild
          className="bg-sunglow text-black hover:bg-yellow-500"
          size="lg"
        >
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  );
}
