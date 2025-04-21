import "dotenv/config";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Event, Media } from "@/payload-types";
import path from "path";
import { makeEventSeed } from "./0.template";

// Minimal Lexical serialized state
const createRichText = (text: string) =>
  ({
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              version: 1,
            },
          ],
        },
      ],
      direction: "ltr",
    },
  }) as any;

const seeds: any[] = [
  {
    slug: "payload-cms-launch-party",
    status: "upcoming",
    title: "Payload CMS Launch Party",
    eventDate: new Date().toISOString(),
    summary:
      "Join us to celebrate the launch of our Payload CMS integration! Network, learn, and have fun.",
    location: "Payload HQ, Virtual Space",
    content: [
      {
        blockType: "EventDetails",
        heading: "Party Details",
        richText: createRichText(
          "Welcome to the official launch party! We'll have demos, Q&A sessions, and virtual networking rooms.",
        ),
        layout: "default",
      },
      {
        blockType: "EventSpeaker",
        name: "Payload Bot",
        role: "Lead Developer",
        image: "",
        description: createRichText(
          "The mastermind behind the scenes, ready to answer your toughest questions.",
        ),
        socialLinks: [
          { platform: "twitter", url: "https://twitter.com/payloadcms" },
          { platform: "website", url: "https://payloadcms.com" },
        ],
        layout: "standard",
      },
      {
        blockType: "EventCredits",
        heading: "Event Team",
        credits: [
          {
            name: "Marketing Team",
            roles: [{ role: "Promotion" }, { role: "Social Media" }],
          },
          {
            name: "Dev Team",
            roles: [{ role: "Integration" }, { role: "Support" }],
            social: "https://github.com/payloadcms",
          },
        ],
        layout: "standard",
      },
      {
        blockType: "EventSpeakers",
        heading: "Speakers Grid",
        speakers: [
          {
            name: "Jane Doe",
            role: "Developer Advocate",
            bio: "Passionate about communities and coding.",
            image: "",
            socialLinks: [
              { platform: "twitter", url: "https://twitter.com/janedoe" },
            ],
          },
        ],
        columns: "3",
        layout: "grid",
      },
      {
        blockType: "EventGallery",
        heading: "Event Gallery",
        description: "Check out our event highlights.",
        images: [
          {
            image: "",
            caption: "Kickoff",
            altText: "Event kickoff session",
          },
          {
            image: "",
            caption: "Closing",
            altText: "Event closing session",
          },
        ],
        layout: "grid",
        columns: "3",
      },
    ],
  },
  {
    slug: "community-meetup-drizzle-payload",
    status: "upcoming",
    title: "Community Meetup: Drizzle & Payload",
    eventDate: new Date().toISOString(),
    summary:
      "Connect with fellow developers working with Drizzle ORM and Payload CMS.",
    location: "Online via Zoom",
    content: [
      {
        blockType: "EventDetails",
        heading: "Meetup Details",
        richText: createRichText("Join the discussion!"),
      },
    ],
  },
];

export default async () => {
  // Payload CMS initialization & media seeding
  const payload = await getPayload({ config: configPromise });
  const seedImageRelativePath =
    "../seed-storage/artwork-assets/247dbc2a-3d80-49f6-83db-6a6ae3497b2a/lukewarm._the_starry_night_3f67cc86-d07f-4e37-8f4a-c60b4405832c.png";
  const filename = path.basename(seedImageRelativePath);
  let mediaId: string | number;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });
  if (existing.docs.length > 0) {
    mediaId = existing.docs[0].id;
  } else {
    const created = await payload.create({
      collection: "media",
      data: { alt: filename },
      filePath: path.resolve(__dirname, seedImageRelativePath),
    });
    mediaId = created.id;
  }

  // Assign featuredImage to all seeds
  seeds.forEach((seed) => {
    seed.featuredImage = mediaId;
  });
  // Update the nested speaker image in the first seed
  seeds[0].content[1].image = mediaId;

  // Auto-fill upload fields in placeholder content blocks
  seeds[0].content.forEach((block: any) => {
    if (block.blockType === "EventSpeakers" && Array.isArray(block.speakers)) {
      block.speakers.forEach((s: any) => {
        s.image = mediaId;
      });
    }
    if (block.blockType === "EventGallery" && Array.isArray(block.images)) {
      block.images.forEach((i: any) => {
        i.image = mediaId;
      });
    }
  });

  // Event seeds
  for (const data of seeds) {
    await makeEventSeed(data)();
  }
};
