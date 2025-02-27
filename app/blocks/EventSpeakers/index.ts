import { Block } from "payload";

export const EventSpeakers: Block = {
  slug: "EventSpeakers",
  labels: {
    singular: "Event Speakers Grid",
    plural: "Event Speakers Grids",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Speakers",
    },
    {
      name: "speakers",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description: "Add all speakers for this section",
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
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "socialLinks",
          type: "array",
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
          ],
        },
      ],
    },
    {
      name: "columns",
      type: "select",
      defaultValue: "3",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "List", value: "list" },
        { label: "Carousel", value: "carousel" },
      ],
    },
  ],
};
