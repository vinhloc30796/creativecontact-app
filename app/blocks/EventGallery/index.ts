import { Block } from "payload";

// Add note to help future devs understand enum constraint
// NOTE: The `columns` field stores a Postgres enum with allowed values "2", "3", and "4" only.
// Seeds or migrations that provide any other value (e.g., "1") will fail at runtime with
// `invalid input value for enum payload.enum_events_blocks_event_gallery_columns`.
// Keep the options list in sync with the database enum!
export const EventGallery: Block = {
  slug: "EventGallery",
  labels: {
    singular: "Event Gallery",
    plural: "Event Galleries",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Event Gallery",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "images",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description: "Add images to the gallery",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
        },
        {
          name: "altText",
          type: "text",
        },
      ],
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Masonry", value: "masonry" },
        { label: "Carousel", value: "carousel" },
        { label: "Fullwidth", value: "fullwidth" },
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
      admin: {
        // Provide inline guidance in the admin UI
        description:
          "Select 2–4 columns. Any other value will cause a database validation error.",
        condition: (data: any) =>
          data.layout === "grid" || data.layout === "masonry",
      },
    },
  ],
};
