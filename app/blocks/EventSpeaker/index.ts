import { Block } from "payload";
import richText from "../../fields/richText";

export const EventSpeaker: Block = {
  slug: "EventSpeaker",
  labels: {
    singular: "Event Speaker",
    plural: "Event Speakers",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
    },
    {
      name: "bio",
      type: "textarea",
    },
    richText({
      name: "description",
    }),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Profile photo of the speaker",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      admin: {
        description: "Social media links for this speaker",
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          dbName: "social_platform",
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "Twitter/X", value: "twitter" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Facebook", value: "facebook" },
            { label: "YouTube", value: "youtube" },
            { label: "Website", value: "website" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
        {
          name: "label",
          type: "text",
          admin: {
            condition: (data: any, siblingData: any) =>
              siblingData.platform === "other",
          },
        },
      ],
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "standard",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Compact", value: "compact" },
        { label: "Expanded", value: "expanded" },
      ],
    },
  ],
};
