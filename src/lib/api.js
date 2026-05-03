import { getAuthSession } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const session = getAuthSession();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
}

export function toFrontendMenuItem(item) {
  return {
    id: item._id,
    name: item.name,
    description: item.description || "",
    price: item.price,
    category: item.category,
    is_veg: item.isVeg,
    is_spicy: item.isSpicy,
    prep_time_minutes: item.prepTimeMinutes,
    is_available: item.isAvailable,
  };
}

export function toBackendMenuItem(item) {
  return {
    name: item.name,
    description: item.description || "",
    price: Number(item.price),
    category: item.category,
    isVeg: Boolean(item.is_veg),
    isSpicy: Boolean(item.is_spicy),
    prepTimeMinutes: Number(item.prep_time_minutes || 5),
    isAvailable: Boolean(item.is_available),
  };
}

export async function fetchMenuItems() {
  const items = await request("/menu");
  return items.map(toFrontendMenuItem);
}

export async function createMenuItem(item) {
  const saved = await request("/menu", {
    method: "POST",
    body: JSON.stringify(toBackendMenuItem(item)),
  });

  return toFrontendMenuItem(saved);
}

export async function updateMenuItem(id, item) {
  const saved = await request(`/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(toBackendMenuItem(item)),
  });

  return toFrontendMenuItem(saved);
}

export async function toggleMenuItemAvailability(id) {
  const saved = await request(`/menu/${id}/availability`, {
    method: "PATCH",
  });

  return toFrontendMenuItem(saved);
}

export async function deleteMenuItem(id) {
  await request(`/menu/${id}`, {
    method: "DELETE",
  });
}

function toBackendOrderItem(item) {
  return {
    menuItemId: item.menuItemId,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    isVeg: Boolean(item.isVeg),
    prepTimeMinutes: Number(item.prep_time_minutes || 5),
  };
}

function toFrontendOrderItem(item) {
  return {
    menuItemId: item.menuItemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    isVeg: item.isVeg,
    prep_time_minutes: item.prepTimeMinutes,
  };
}

export function toFrontendOrder(order) {
  return {
    id: order._id,
    token_number: order.tokenNumber,
    items: (order.items || []).map(toFrontendOrderItem),
    total_amount: order.totalAmount,
    estimated_time: order.estimatedTimeMinutes,
    status: order.status,
    created_at: order.createdAt,
    customer_name: order.customerName || "",
    customer_note: order.customerNote || "",
  };
}

export function toBackendOrder(order) {
  return {
    items: (order.items || []).map(toBackendOrderItem),
    totalAmount: Number(order.total_amount),
    estimatedTimeMinutes: Number(order.estimated_time),
    status: order.status || "placed",
    customerName: order.customer_name || "",
    customerNote: order.customer_note || "",
  };
}

export async function createOrder(order) {
  const saved = await request("/orders", {
    method: "POST",
    body: JSON.stringify(toBackendOrder(order)),
  });

  return toFrontendOrder(saved);
}

export async function fetchOrders() {
  const orders = await request("/orders");
  return orders.map(toFrontendOrder);
}

export async function updateOrderStatus(id, status) {
  const saved = await request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  return toFrontendOrder(saved);
}

export async function fetchOrderByToken(tokenNumber) {
  const order = await request(`/orders/token/${tokenNumber}`);
  return toFrontendOrder(order);
}