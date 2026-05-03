import { useEffect, useState } from "react";
import {
  createMenuItem,
  deleteMenuItem,
  fetchMenuItems,
  toggleMenuItemAvailability,
  updateMenuItem,
} from "./api";

const listeners = new Set();
let cache = [];
let loaded = false;
let loadingPromise = null;

function notify() {
  listeners.forEach((l) => l());
}

async function loadMenu(force = false) {
  if (loaded && !force) {
    return cache;
  }

  if (!loadingPromise) {
    loadingPromise = fetchMenuItems()
      .then((items) => {
        cache = items;
        loaded = true;
        notify();
        return items;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export const menuStore = {
  getItems() {
    return cache;
  },

  async load() {
    return loadMenu();
  },

  async add(item) {
    const saved = await createMenuItem(item);
    cache = [saved, ...cache];
    loaded = true;
    notify();
    return saved;
  },

  async remove(id) {
    await deleteMenuItem(id);
    cache = cache.filter((i) => i.id !== id);
    notify();
  },

  async toggleAvailability(id) {
    const updatedItem = await toggleMenuItemAvailability(id);
    cache = cache.map((i) => (i.id === id ? updatedItem : i));
    notify();
    return updatedItem;
  },

  async update(updatedItem) {
    const saved = await updateMenuItem(updatedItem.id, updatedItem);
    cache = cache.map((item) => (item.id === updatedItem.id ? saved : item));
    loaded = true;
    notify();
    return saved;
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useMenu() {
  const [state, setState] = useState(() => ({
    items: cache,
    loading: !loaded,
    error: null,
  }));

  useEffect(() => {
    let alive = true;

    menuStore
      .load()
      .then((items) => {
        if (!alive) return;
        setState({ items, loading: false, error: null });
      })
      .catch((error) => {
        if (!alive) return;
        setState({ items: [], loading: false, error: error.message });
      });

    const unsub = menuStore.subscribe(() => {
      if (!alive) return;
      setState({ items: menuStore.getItems(), loading: false, error: null });
    });

    return () => {
      alive = false;
      unsub();
    };
  }, []);

  return state;
}