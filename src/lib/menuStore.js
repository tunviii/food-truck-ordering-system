import { useEffect, useState } from "react";

const STORAGE_KEY = "wokroll_menu";
const listeners = new Set();

const DEFAULT_MENU = [
  {
    id: "1",
    name: "Veg Hakka Noodles",
    description: "Classic noodles",
    price: 80,
    category: "noodles",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 8,
    is_available: true,
  }
];

function readMenu() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU));
      return DEFAULT_MENU;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MENU;
  }
}

function writeMenu(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export const menuStore = {
  getItems: readMenu,

  add(item) {
    const items = readMenu();
    items.push(item);
    writeMenu(items);
  },

  remove(id) {
    writeMenu(readMenu().filter((i) => i.id !== id));
  },

  toggleAvailability(id) {
    const items = readMenu().map((i) =>
      i.id === id ? { ...i, is_available: !i.is_available } : i
    );
    writeMenu(items);
  },

  update(updatedItem) {
  const items = readMenu().map((item) =>
    item.id === updatedItem.id ? updatedItem : item
  );
  writeMenu(items);
},

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useMenu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(menuStore.getItems());
    const unsub = menuStore.subscribe(() =>
      setItems(menuStore.getItems())
    );
    return unsub;
  }, []);

  return items;
}