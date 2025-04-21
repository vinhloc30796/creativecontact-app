import { Block } from "payload";
import richText from "@/app/fields/richText";

export const EventDetails: Block = {
  slug: "EventDetails",
  interfaceName: "EventDetailsBlock",
  labels: {
    singular: "Event Details",
    plural: "Event Details",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    richText(),
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional background image for this section",
      },
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Wide", value: "wide" },
        { label: "Full Width", value: "fullWidth" },
      ],
    },
  ],
};
