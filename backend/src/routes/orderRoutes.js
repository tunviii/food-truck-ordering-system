import express from "express";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createOrder as createDemoOrder, findOrderByToken, isDemoMode, listOrders as listDemoOrders, updateOrderStatus as updateDemoOrderStatus } from "../lib/demoStore.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("admin", "kitchen"), async (_req, res, next) => {
  try {
    if (isDemoMode()) {
      return res.json(listDemoOrders());
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const order = createDemoOrder({
        items: req.body.items,
        totalAmount: req.body.totalAmount,
        estimatedTimeMinutes: req.body.estimatedTimeMinutes,
        status: req.body.status,
        customerName: req.body.customerName,
        customerNote: req.body.customerNote,
      });

      return res.status(201).json(order);
    }

    const existingCount = await Order.countDocuments();
    const order = await Order.create({
      ...req.body,
      tokenNumber: existingCount + 1,
    });

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
});

router.get("/token/:tokenNumber", async (req, res, next) => {
  try {
    const { tokenNumber } = req.params;
    if (isDemoMode()) {
      const order = findOrderByToken(tokenNumber);
      if (!order) return res.status(404).json({ message: "Order not found." });
      return res.json(order);
    }

    const order = await Order.findOne({ tokenNumber: Number(tokenNumber) });
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/status", requireAuth, requireRole("admin", "kitchen"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (isDemoMode()) {
      const order = updateDemoOrderStatus(req.params.id, status);
      if (!order) return res.status(404).json({ message: "Order not found." });
      return res.json(order);
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

export default router;