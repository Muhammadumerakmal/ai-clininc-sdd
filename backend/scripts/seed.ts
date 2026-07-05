import { connectDatabase, disconnectDatabase } from "../src/config/database";
import { Clinic } from "../src/models/Clinic";

async function seed() {
  await connectDatabase();

  const clinic = await Clinic.create({
    name: "Main Clinic",
    address: "123 Health Street",
    phone: "+1-555-0100",
    email: "clinic@example.com",
  });

  console.log("Clinic created!");
  console.log(`ID: ${clinic.id}`);
  console.log(`Name: ${clinic.name}`);
  console.log("");
  console.log("Use this ID when registering users.");

  await disconnectDatabase();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
