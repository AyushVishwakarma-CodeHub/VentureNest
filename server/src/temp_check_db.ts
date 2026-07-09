import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDb() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    return;
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // Check Users
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log("\n--- USERS IN DATABASE ---");
  for (const u of users) {
    console.log(`ID: ${u._id}, Name: ${u.firstName} ${u.lastName}, Email: ${u.email}, Role: ${u.role}`);
  }

  // Check Startups
  const startups = await mongoose.connection.db.collection('startups').find({}).toArray();
  console.log("\n--- STARTUPS IN DATABASE ---");
  for (const s of startups) {
    console.log(`ID: ${s._id}, Name: ${s.name}, Slug: ${s.slug}, Founder: ${s.founder}, Stage: ${s.stage}`);
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from DB.");
}

checkDb().catch(console.error);
