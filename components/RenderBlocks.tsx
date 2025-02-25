"use client";

import React from "react";
import { H2, P } from "@/components/ui/typography";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BlockTypes,
  EventDetailsBlock,
  EventSpeakerBlock,
  EventSpeakersBlock,
  EventGalleryBlock,
  EventCreditsBlock,
  isBlockType,
  getMediaUrl,
  getMediaAlt,
  getOrDefault,
} from "@/lib/payload/payloadTypeAdapter";

// Use the types from our adapter
interface RenderBlocksProps {
  blocks: BlockTypes[];
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  return (
    <div className="flex flex-col gap-16">
      {blocks.map((block, index) => {
        // Render different blocks based on their blockType
        switch (block.blockType) {
          case "EventDetails":
            return <EventDetailsRenderer key={index} {...block} />;
          case "EventSpeaker":
            return <EventSpeakerRenderer key={index} {...block} />;
          case "EventSpeakers":
            return <EventSpeakersRenderer key={index} {...block} />;
          case "EventGallery":
            return <EventGalleryRenderer key={index} {...block} />;
          case "EventCredits":
            return <EventCreditsRenderer key={index} {...block} />;
          default:
            // For unrecognized blocks or debugging
            return (
              <div
                key={index}
                className="rounded-md border border-dashed border-gray-300 p-4"
              >
                <p className="text-muted-foreground">
                  Unsupported block type: {(block as any).blockType}
                </p>
              </div>
            );
        }
      })}
    </div>
  );
}

// Individual block renderers
function EventDetailsRenderer(block: EventDetailsBlock) {
  const { heading, richText, backgroundImage, layout } = block;
  const containerClasses = {
    default: "max-w-3xl mx-auto",
    wide: "max-w-5xl mx-auto",
    fullWidth: "w-full",
  }[getOrDefault(layout, "default")];

  return (
    <section className={containerClasses}>
      {backgroundImage && (
        <div className="relative mb-8 h-[300px] overflow-hidden rounded-xl">
          <Image
            src={getMediaUrl(backgroundImage)}
            alt={getMediaAlt(backgroundImage) || heading}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <H2 className="text-white">{heading}</H2>
          </div>
        </div>
      )}

      {!backgroundImage && <H2 className="mb-6">{heading}</H2>}

      <div className="prose prose-lg max-w-none">
        {/* For simplicity, rendering as plain text here */}
        <div>
          {richText && typeof richText === "string" ? (
            <P>{richText}</P>
          ) : (
            <P>Rich text content would be rendered here</P>
          )}
        </div>
      </div>
    </section>
  );
}

function EventSpeakerRenderer(block: EventSpeakerBlock) {
  const { name, role, bio, image, socialLinks, layout } = block;
  const layoutValue = getOrDefault(layout, "standard");

  return (
    <section className="mx-auto max-w-4xl">
      <div
        className={`flex ${layoutValue === "standard" ? "flex-col gap-8 md:flex-row" : "flex-col gap-6"}`}
      >
        <div
          className={`${layoutValue === "standard" ? "md:w-1/3" : "w-full"}`}
        >
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={getMediaUrl(image)}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div className="mt-4 flex justify-center gap-3 md:justify-start">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        <div
          className={`${layoutValue === "standard" ? "md:w-2/3" : "w-full"}`}
        >
          <H2>{name}</H2>
          {role && <P className="font-medium text-primary">{role}</P>}

          {bio && (
            <div className="mt-4">
              <P>{bio}</P>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EventSpeakersRenderer(block: EventSpeakersBlock) {
  const { heading = "Speakers", speakers, columns, layout } = block;
  const columnsValue = getOrDefault(columns, "3");
  const layoutValue = getOrDefault(layout, "grid");

  const gridCols = {
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columnsValue];

  return (
    <section className="mx-auto max-w-5xl">
      <H2 className="mb-8">{heading}</H2>

      {layoutValue === "grid" && (
        <div className={`grid ${gridCols} gap-8`}>
          {speakers.map((speaker, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={getMediaUrl(speaker.image)}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <p className="text-lg font-bold">{speaker.name}</p>
                {speaker.role && <p className="text-primary">{speaker.role}</p>}
                {speaker.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {speaker.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {layoutValue === "list" && (
        <div className="flex flex-col gap-6">
          {speakers.map((speaker, index) => (
            <div key={index} className="flex items-center gap-4 border-b p-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={getMediaUrl(speaker.image)}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold">{speaker.name}</p>
                {speaker.role && (
                  <p className="text-sm text-primary">{speaker.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel layout would require a carousel component */}
      {layoutValue === "carousel" && (
        <div className="rounded-md border border-dashed p-4">
          <p className="text-muted-foreground">
            Carousel layout would be implemented here
          </p>
        </div>
      )}
    </section>
  );
}

function EventGalleryRenderer(block: EventGalleryBlock) {
  const {
    heading = "Event Gallery",
    description,
    images,
    layout,
    columns,
  } = block;
  const columnsValue = getOrDefault(columns, "3");
  const layoutValue = getOrDefault(layout, "grid");

  const gridCols = {
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columnsValue];

  return (
    <section className="mx-auto max-w-5xl">
      <H2 className="mb-4">{heading}</H2>
      {description && (
        <P className="mb-8 text-muted-foreground">{description}</P>
      )}

      {layoutValue === "grid" && (
        <div className={`grid ${gridCols} gap-4`}>
          {images.map((item, index) => (
            <div key={index} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={getMediaUrl(item.image)}
                  alt={
                    item.altText || item.caption || `Gallery image ${index + 1}`
                  }
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              {item.caption && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Other layouts would be implemented similarly */}
      {layoutValue !== "grid" && (
        <div className="rounded-md border border-dashed p-4">
          <p className="text-muted-foreground">
            {layoutValue.charAt(0).toUpperCase() + layoutValue.slice(1)} layout
            would be implemented here
          </p>
        </div>
      )}
    </section>
  );
}

function EventCreditsRenderer(block: EventCreditsBlock) {
  const { heading = "Credits", credits, layout } = block;
  const layoutValue = getOrDefault(layout, "standard");

  return (
    <section className="mx-auto max-w-4xl">
      <H2 className="mb-6">{heading}</H2>

      <div
        className={
          layoutValue === "standard"
            ? "grid gap-6 md:grid-cols-2"
            : "flex flex-col gap-4"
        }
      >
        {credits.map((credit, index) => (
          <div
            key={index}
            className={
              layoutValue === "compact" ? "flex items-center gap-4" : "mb-4"
            }
          >
            <div>
              <p className="font-bold">{credit.name}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {credit.roles.map((role, roleIndex) => (
                  <Badge key={roleIndex} variant="outline">
                    {role.role}
                  </Badge>
                ))}
              </div>
              {credit.social && layoutValue === "detailed" && (
                <a
                  href={credit.social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-primary"
                >
                  {credit.social}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
