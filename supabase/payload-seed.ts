import 'dotenv/config'; // Keep this if using the default .env load via package.json script preloading
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Event, Media } from "@/payload-types";
import path from 'path'; // Ensure path is imported

// -- Environment Variables --
// List all environment variables
const envVars = process.env;
console.log(`➡️ Environment Variables: ${envVars}`);

// --- Configuration & Path Debugging ---
console.log(`➡️ Script directory (__dirname): ${__dirname}`); // Log script directory

// Relative path from this script (__dirname) to the seed image file
const seedImageRelativePath = './seed-storage/artwork-assets/247dbc2a-3d80-49f6-83db-6a6ae3497b2a/lukewarm._the_starry_night_3f67cc86-d07f-4e37-8f4a-c60b4405832c.png';
console.log(`➡️ Relative image path used: ${seedImageRelativePath}`); // Log relative path

const seedImageFilename = path.basename(seedImageRelativePath);
const seedImageAltText = "Abstract representation similar to Starry Night";

// Construct the absolute path using path.resolve() anchored to __dirname
const absoluteImagePath = path.resolve(__dirname, seedImageRelativePath);
console.log(`➡️ Resolved absolute image path: ${absoluteImagePath}`); // Log final absolute path (this will be used later)

// Define a minimal type structure compatible with Lexical's SerializedEditorState
// Updated to use the specific format literals identified by the previous linter error.
type MinimalSerializedEditorState = {
  root: {
    type: 'root';
    format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'; // Use specific allowed format values
    indent: number;
    version: number;
    children: Array<any>; // Use 'any' for simplicity in this minimal type
    direction: 'ltr' | 'rtl' | null;
  };
  [key: string]: unknown; // Allow other properties if needed
};

/**
 * Helper function to create a basic Lexical editor state object.
 * Returns an object conforming to MinimalSerializedEditorState.
 */
const createRichText = (text: string): MinimalSerializedEditorState => ({
  root: {
    type: 'root',
    format: '', // Default format is empty string, which is valid
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: text,
            version: 1,
          },
        ],
      },
    ],
    direction: 'ltr',
  },
});

/**
 * Seeds the database with initial media and event data.
 */
const seedDatabase = async () => {
  console.log("🌱 Starting database seeding process...");

  try {
    const payload = await getPayload({
      config: configPromise,
    });
    console.log("✅ Payload initialized.");

    // --- Seed Media Item ---
    let mediaId: string | number | undefined; // Use string | number based on your Media collection ID type

    console.log(`🖼️ Checking for existing media item: "${seedImageFilename}"...`);
    const existingMedia = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: seedImageFilename,
        },
      },
      limit: 1,
    });

    if (existingMedia.docs.length > 0) {
      mediaId = existingMedia.docs[0].id;
      console.log(`⏭️ Media item "${seedImageFilename}" already exists (ID: ${mediaId}). Skipping creation.`);
    } else {
      console.log(`➕ Creating media item from file: "${seedImageFilename}"...`);
      // Resolve path just before use
      const absoluteImagePath = path.resolve(__dirname, seedImageRelativePath);
      console.log(`   Using absolute path for Payload: ${absoluteImagePath}`); // Keep this log as it's useful

      const createdMedia = await payload.create({
        collection: 'media',
        data: { // Add any required data fields for your Media collection
          alt: seedImageAltText,
          // Add other required fields if necessary
        },
        filePath: absoluteImagePath, // Provide the absolute path to the file
      });
      mediaId = createdMedia.id;
      console.log(`✅ Successfully created media item: "${createdMedia.filename}" (ID: ${mediaId})`);
    }

    if (!mediaId) {
      console.error("❌ Failed to find or create the required media item. Aborting event seeding.");
      process.exit(1);
    }

    // --- Seed Events ---
    console.log("🗓️ Starting event seeding...");

    // Sample Event 1 Data
    const sampleEventData: Omit<Event, "id" | "createdAt" | "updatedAt"> = {
      title: "Payload CMS Launch Party",
      status: "upcoming",
      summary:
        "Join us to celebrate the launch of our new Payload CMS integration! Network, learn, and have fun.",
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // ~1 week from now
      location: "Payload HQ, Virtual Space",
      featuredImage: mediaId, // Use the obtained media ID
      content: [
        {
          blockType: "EventDetails",
          heading: "Party Details",
          richText: createRichText("Detailed information about the launch party."),
        },
      ],
      registrationRequired: true,
    };

    console.log(`📝 Creating/Checking sample event: "${sampleEventData.title}"...`);
    const existingEvent = await payload.find({
      collection: "events",
      where: { slug: { equals: "payload-cms-launch-party" } },
      limit: 1,
    });

    if (existingEvent.docs.length > 0) {
      console.log(`⏭️ Event "${sampleEventData.title}" already exists. Skipping creation.`);
    } else {
      const createdEvent = await payload.create({ collection: "events", data: sampleEventData });
      console.log(`✅ Successfully created event: "${createdEvent.title}" (ID: ${createdEvent.id})`);
    }

    // Sample Event 2 Data
    const anotherEventData: Omit<Event, "id" | "createdAt" | "updatedAt"> = {
      title: "Community Meetup: Drizzle & Payload",
      status: "upcoming",
      summary: "Discussing the synergy between Drizzle ORM and Payload CMS.",
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // ~2 weeks from now
      location: "Online via Zoom",
      featuredImage: mediaId, // Use the obtained media ID
      content: [
        { blockType: "EventDetails", heading: "Meetup Details", richText: createRichText("Join the discussion!") },
      ],
      registrationRequired: false,
    };

    console.log(`📝 Creating/Checking sample event: "${anotherEventData.title}"...`);
    const existingAnotherEvent = await payload.find({
      collection: "events",
      where: { slug: { equals: "community-meetup-drizzle-payload" } },
      limit: 1,
    });

    if (existingAnotherEvent.docs.length > 0) {
      console.log(`⏭️ Event "${anotherEventData.title}" already exists. Skipping creation.`);
    } else {
      const createdAnotherEvent = await payload.create({ collection: "events", data: anotherEventData });
      console.log(`✅ Successfully created event: "${createdAnotherEvent.title}" (ID: ${createdAnotherEvent.id})`);
    }

    console.log("🏁 Database seeding finished.");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    // Log the full error for more details
    if (error instanceof Error) {
      console.error("Error Details:", error.message);
      if (error.stack) {
        console.error("Stack Trace:", error.stack);
      }
    } else {
      console.error("Unknown error object:", error);
    }
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log("Seeding script completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Unhandled error running seeding script:", err);
    process.exit(1);
  });
