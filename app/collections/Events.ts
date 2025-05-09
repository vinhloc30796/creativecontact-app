import { CollectionConfig } from "payload";
import { anyone } from "./access/anyone";
import { admins } from "./access/admins";
import { slugField } from "../fields/slug";
import { checkRole } from "./access/checkRole";
import { db } from "@/lib/db";
import { integrateEvent } from "@/lib/payload/eventAdapter";
import { canManageContent } from "./access/canManageContent";

// Import block configs
import { EventDetails } from "../blocks/EventDetails";
import { EventSpeaker } from "../blocks/EventSpeaker";
import { EventSpeakers } from "../blocks/EventSpeakers";
import { EventGallery } from "../blocks/EventGallery";
import { EventCredits } from "../blocks/EventCredits";
import { MediaBlock } from "../blocks/Media";

// Events collection to manage events displayed on the website
export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "eventDate", "location", "status"],
  },
  access: {
    read: ({ req: { user } }) =>
      checkRole(["admin", "content-creator", "check-in"], user || undefined),
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField("title"),
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Active", value: "active" },
        { label: "Past", value: "past" },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Brief summary of the event for preview cards (max 200 characters)",
      },
    },
    {
      name: "eventDate",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "When does the event take place?",
      },
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        description:
          "When does the event end? (Leave empty for single-day events)",
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
      admin: {
        description: "Where will the event take place?",
      },
    },
    {
      name: "capacity",
      type: "number",
      admin: {
        description: "Maximum number of attendees (leave empty for unlimited)",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Main image used for event cards and headers",
      },
    },
    {
      name: "content",
      type: "blocks",
      blocks: [
        EventDetails,
        EventSpeaker,
        EventSpeakers,
        EventGallery,
        EventCredits,
        MediaBlock,
        // Other blocks should be imported and added here
      ],
      required: true,
    },
    {
      name: "tags",
      type: "array",
      admin: {
        description: "Tags to categorize this event",
      },
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "registrationRequired",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Does this event require registration?",
      },
    },
    {
      name: "registrationLink",
      type: "text",
      admin: {
        description: "External registration link (if any)",
        condition: (data) => data.registrationRequired,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Automatically set status based on date
        const currentDate = new Date();
        const eventDate = new Date(data.eventDate);

        if (data.status !== "draft") {
          if (eventDate > currentDate) {
            data.status = "upcoming";
          } else {
            data.status = "past";
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc }) => {
        // Integrate with Drizzle database
        try {
          await integrateEvent(db, doc);
          console.log(
            `Successfully integrated event ${doc.title} with Drizzle database`,
          );
        } catch (error) {
          console.error(`Error integrating event with Drizzle:`, error);
        }

        return doc;
      },
    ],
  },
};
