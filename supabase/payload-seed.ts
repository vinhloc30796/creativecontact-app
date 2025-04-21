import "dotenv/config";
import placeholderSeed from "./payload-seeds/1.placeholder";
import photox3dSeed from "./payload-seeds/2.photox3d";

async function runSeed() {
  try {
    await placeholderSeed();
    await photox3dSeed();
    console.log("🌱 Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  }
}

runSeed();
