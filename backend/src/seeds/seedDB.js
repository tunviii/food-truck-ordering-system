import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import { isDemoMode } from "../lib/demoStore.js";

dotenv.config();

const demoMenuItems = [
  {
    name: "Hakka Noodles",
    description: "Stir-fried noodles with vegetables and soy sauce",
    price: 80,
    category: "noodles",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 5,
    isAvailable: true,
  },
  {
    name: "Chicken Fried Rice",
    description: "Fragrant rice with tender chicken pieces",
    price: 100,
    category: "rice",
    isVeg: false,
    isSpicy: false,
    prepTimeMinutes: 6,
    isAvailable: true,
  },
  {
    name: "Veg Manchurian",
    description: "Crispy vegetable balls in spicy manchurian sauce",
    price: 120,
    category: "manchurian",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 7,
    isAvailable: true,
  },
  {
    name: "Spring Rolls (4 pcs)",
    description: "Golden crispy rolls with vegetable filling",
    price: 60,
    category: "starters",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 4,
    isAvailable: true,
  },
  {
    name: "Tomato Soup",
    description: "Hot tomato soup with croutons",
    price: 40,
    category: "soups",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 3,
    isAvailable: true,
  },
  {
    name: "Mango Lassi",
    description: "Refreshing yogurt-based mango beverage",
    price: 50,
    category: "beverages",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 2,
    isAvailable: true,
  },
  {
    name: "Paneer Combo",
    description: "Paneer tikka + naan + rice",
    price: 180,
    category: "combos",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 12,
    isAvailable: true,
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant rice cooked with marinated chicken",
    price: 150,
    category: "rice",
    isVeg: false,
    isSpicy: false,
    prepTimeMinutes: 10,
    isAvailable: true,
  },
];

const demoUsers = [
  {
    email: "admin@campus.local",
    password: "admin123",
    role: "admin",
  },
  {
    email: "kitchen@campus.local",
    password: "kitchen123",
    role: "kitchen",
  },
];

async function seedDB() {
  try {
    if (isDemoMode()) {
      console.log("Demo mode is enabled. The app already uses in-memory sample data, so seeding is not required.");
      process.exit(0);
    }

    await connectDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert menu items
    const insertedItems = await MenuItem.insertMany(demoMenuItems);
    console.log(`✅ Added ${insertedItems.length} menu items`);

    // Insert users (password will be hashed by pre-save hook)
    const insertedUsers = await User.insertMany(demoUsers);
    console.log(`✅ Added ${insertedUsers.length} demo users`);

    console.log("\n📋 Demo Users:");
    demoUsers.forEach((user) => {
      console.log(`  - ${user.email} / ${user.password} (role: ${user.role})`);
    });

    console.log("\n🍜 Demo Menu Items:");
    insertedItems.forEach((item) => {
      console.log(`  - ${item.name} (₹${item.price}, ${item.prepTimeMinutes}min)`);
    });

    console.log("\n✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDB();
