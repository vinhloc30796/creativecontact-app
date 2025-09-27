"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, ChevronRight } from "lucide-react";
import EventLogo from "@/components/branding/EventLogo";

interface AboutEventDialogProps {
  trigger: React.ReactNode;
  title: string;
  body: string;
  eventSlug: string;
  igUrl?: string;
  fbUrl?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function AboutEventDialog({
  trigger,
  title,
  body,
  eventSlug,
  igUrl,
  fbUrl,
  ctaText,
  ctaHref,
}: AboutEventDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="inset-0 left-0 top-0 z-50 h-[100dvh] w-screen translate-x-0 translate-y-0 max-w-none rounded-none bg-background p-6 sm:p-8 md:p-10 overflow-y-auto">
        <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-[50vw]">
            <EventLogo
              eventSlug={eventSlug}
              eventTitle={title}
              className="mx-auto h-auto w-[min(50vw,600px)]"
            />
          </div>

          <div className="mx-auto mt-6 max-w-6xl space-y-8">
            <p className="mx-auto whitespace-pre-line text-muted-foreground leading-snug text-[clamp(1.25rem,4.5vw,2.75rem)]">
              {body}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {igUrl && (
                <Link
                  href={igUrl}
                  className="inline-flex items-center gap-3 text-primary hover:underline"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-7 w-7" />
                  <span className="text-[clamp(1rem,2.5vw,1.5rem)]">Instagram</span>
                </Link>
              )}
              {fbUrl && (
                <Link
                  href={fbUrl}
                  className="inline-flex items-center gap-3 text-primary hover:underline"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-7 w-7" />
                  <span className="text-[clamp(1rem,2.5vw,1.5rem)]">Facebook</span>
                </Link>
              )}
            </div>

            {ctaText && (
              <div className="pt-4">
                <div className="inline-flex items-center font-extrabold text-[clamp(1rem,2.75vw,1.75rem)]">
                  <span className="mr-2">{ctaText}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AboutEventDialog;


