import mongoose from "mongoose";

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    return null;
  }

  await mongoose.connect(mongoUri);
}