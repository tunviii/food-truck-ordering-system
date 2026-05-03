import { useEffect, useState } from "react";

const STORAGE_KEY = "wokroll_cart";
const listeners = new Set();

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export const cartStore = {
  getItems: readCart,

  add(item) {
    const items = readCart();
    const existing = items.find((i) => i.menuItemId === item.menuItemId);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }

    writeCart(items);
  },

  remove(menuItemId) {
    writeCart(readCart().filter((i) => i.menuItemId !== menuItemId));
  },

  setQuantity(menuItemId, quantity) {
    const items = readCart();
    const item = items.find((i) => i.menuItemId === menuItemId);

    if (!item) return;

    if (quantity <= 0) {
      writeCart(items.filter((i) => i.menuItemId !== menuItemId));
    } else {
      item.quantity = quantity;
      writeCart(items);
    }
  },

  clear() {
    writeCart([]);
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useCart() {
  const [items, setItems] = useState(() => cartStore.getItems());

  useEffect(() => {
    const unsub = cartStore.subscribe(() =>
      setItems(cartStore.getItems())
    );

    return () => unsub();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return { items, totalItems, totalAmount };
}