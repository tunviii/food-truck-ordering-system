import express from "express";
import MenuItem from "../models/MenuItem.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createMenuItem, deleteMenuItem, isDemoMode, listMenuItems, toggleMenuItemAvailability, updateMenuItem } from "../lib/demoStore.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    if (isDemoMode()) {
      return res.json(listMenuItems());
    }

    const items = await MenuItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const item = createMenuItem(req.body);
      return res.status(201).json(item);
    }

    const item = await MenuItem.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const item = updateMenuItem(req.params.id, req.body);
      if (!item) return res.status(404).json({ message: "Menu item not found." });
      return res.json(item);
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/availability", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const item = toggleMenuItemAvailability(req.params.id);
      if (!item) return res.status(404).json({ message: "Menu item not found." });
      return res.json(item);
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });

    item.isAvailable = !item.isAvailable;
    await item.save();

    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const item = deleteMenuItem(req.params.id);
      if (!item) return res.status(404).json({ message: "Menu item not found." });
      return res.status(204).send();
    }

    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;