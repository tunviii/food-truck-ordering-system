import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["noodles", "rice", "manchurian", "starters", "soups", "beverages", "combos"],
    },
    isVeg: { type: Boolean, default: true },
    isSpicy: { type: Boolean, default: false },
    prepTimeMinutes: { type: Number, default: 5, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);