import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    isVeg: { type: Boolean, default: true },
    prepTimeMinutes: { type: Number, default: 5 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    tokenNumber: { type: Number, required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    estimatedTimeMinutes: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["placed", "accepted", "cooking", "ready", "completed", "cancelled"],
      default: "placed",
    },
    customerName: { type: String, default: "" },
    customerNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);