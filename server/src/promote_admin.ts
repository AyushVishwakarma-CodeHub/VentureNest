import mongoose from "mongoose";
import { User } from "./models/User";
import { UserRole } from "./types";
import { env } from "./config/env";
import logger from "./utils/logger";

async function promoteAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide the email address: npx tsx src/promote_admin.ts <email>");
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(env.MONGODB_URI);
    console.log(`Connected to MongoDB.`);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error(`Error: User with email ${email} not found.`);
      process.exit(1);
    }

    user.role = UserRole.ADMIN;
    await user.save();

    console.log(`Success: User ${user.firstName} ${user.lastName} (${user.email}) promoted to ADMIN role.`);
    process.exit(0);
  } catch (error) {
    console.error("Database connection or promotion error:", error);
    process.exit(1);
  }
}

promoteAdmin();
