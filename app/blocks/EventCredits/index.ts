import { Block } from "payload";

export const EventCredits: Block = {
  slug: "EventCredits",
  labels: {
    singular: "Event Credits",
    plural: "Event Credits",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Credits",
    },
    {
      name: "credits",
      type: "array",
      required: true,
      admin: {
        description: "Add all contributors to this event",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "roles",
          type: "array",
          required: true,
          fields: [
            {
              name: "role",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "social",
          type: "text",
          admin: {
            description: "Optional social media link or website",
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
        { label: "Detailed", value: "detailed" },
      ],
    },
  ],
};
