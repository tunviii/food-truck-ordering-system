import { randomUUID } from "crypto";

const createTimestamp = () => new Date().toISOString();

const menuItems = [
  {
    _id: "demo-menu-1",
    name: "Hakka Noodles",
    description: "Stir-fried noodles with vegetables and soy sauce",
    price: 80,
    category: "noodles",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 5,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-2",
    name: "Chicken Fried Rice",
    description: "Fragrant rice with tender chicken pieces",
    price: 100,
    category: "rice",
    isVeg: false,
    isSpicy: false,
    prepTimeMinutes: 6,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-3",
    name: "Veg Manchurian",
    description: "Crispy vegetable balls in spicy manchurian sauce",
    price: 120,
    category: "manchurian",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 7,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-4",
    name: "Spring Rolls (4 pcs)",
    description: "Golden crispy rolls with vegetable filling",
    price: 60,
    category: "starters",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 4,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-5",
    name: "Tomato Soup",
    description: "Hot tomato soup with croutons",
    price: 40,
    category: "soups",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 3,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-6",
    name: "Mango Lassi",
    description: "Refreshing yogurt-based mango beverage",
    price: 50,
    category: "beverages",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 2,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-7",
    name: "Paneer Combo",
    description: "Paneer tikka + naan + rice",
    price: 180,
    category: "combos",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 12,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-menu-8",
    name: "Chicken Biryani",
    description: "Fragrant rice cooked with marinated chicken",
    price: 150,
    category: "rice",
    isVeg: false,
    isSpicy: false,
    prepTimeMinutes: 10,
    isAvailable: true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
];

const users = [
  {
    _id: "demo-user-admin",
    name: "Admin",
    email: "admin@campus.local",
    password: "admin123",
    role: "admin",
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
  {
    _id: "demo-user-kitchen",
    name: "Kitchen",
    email: "kitchen@campus.local",
    password: "kitchen123",
    role: "kitchen",
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },
];

let orders = [];
let nextTokenNumber = 1;

function sortNewestFirst(items) {
  return [...items].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export function isDemoMode() {
  return !process.env.MONGO_URI;
}

export function listMenuItems() {
  return sortNewestFirst(menuItems);
}

export function createMenuItem(input) {
  const item = {
    _id: `demo-menu-${randomUUID()}`,
    name: input.name,
    description: input.description || "",
    price: Number(input.price),
    category: input.category,
    isVeg: Boolean(input.isVeg),
    isSpicy: Boolean(input.isSpicy),
    prepTimeMinutes: Number(input.prepTimeMinutes || 5),
    isAvailable: input.isAvailable !== undefined ? Boolean(input.isAvailable) : true,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  };

  menuItems.unshift(item);
  return item;
}

export function updateMenuItem(id, updates) {
  const index = menuItems.findIndex((item) => item._id === id);
  if (index === -1) return null;

  menuItems[index] = {
    ...menuItems[index],
    ...updates,
    _id: menuItems[index]._id,
    updatedAt: createTimestamp(),
  };

  return menuItems[index];
}

export function toggleMenuItemAvailability(id) {
  const item = menuItems.find((entry) => entry._id === id);
  if (!item) return null;

  item.isAvailable = !item.isAvailable;
  item.updatedAt = createTimestamp();
  return item;
}

export function deleteMenuItem(id) {
  const index = menuItems.findIndex((item) => item._id === id);
  if (index === -1) return null;

  const [removed] = menuItems.splice(index, 1);
  return removed;
}

export function findUserByEmail(email) {
  return users.find((user) => user.email === String(email).toLowerCase()) || null;
}

export function createUser({ name, email, password, role = "student" }) {
  const user = {
    _id: `demo-user-${randomUUID()}`,
    name,
    email: String(email).toLowerCase(),
    password,
    role,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  };

  users.push(user);
  return user;
}

export function listOrders() {
  return sortNewestFirst(orders);
}

export function createOrder(input) {
  const order = {
    _id: `demo-order-${randomUUID()}`,
    tokenNumber: nextTokenNumber,
    items: input.items || [],
    totalAmount: Number(input.totalAmount),
    estimatedTimeMinutes: Number(input.estimatedTimeMinutes),
    status: input.status || "placed",
    customerName: input.customerName || "",
    customerNote: input.customerNote || "",
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  };

  nextTokenNumber += 1;
  orders.unshift(order);
  return order;
}

export function findOrderByToken(tokenNumber) {
  return orders.find((order) => order.tokenNumber === Number(tokenNumber)) || null;
}

export function updateOrderStatus(id, status) {
  const order = orders.find((entry) => entry._id === id);
  if (!order) return null;

  order.status = status;
  order.updatedAt = createTimestamp();
  return order;
}
