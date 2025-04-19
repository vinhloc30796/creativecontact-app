import "dotenv/config";
import placeholderSeed from "./payload-seeds/1.placeholder";

async function runSeed() {
  try {
    await placeholderSeed();
    console.log("🌱 Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  }
}

runSeed();
