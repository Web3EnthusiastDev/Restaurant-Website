import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, placeOrderStripe, verifyOrder, updateStatus, userOrders, confirmCodPayment, assignDelivery } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/stripe", placeOrderStripe);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/status", authMiddleware, updateStatus);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", authMiddleware, listOrders);
orderRouter.post("/confirm-cod", authMiddleware, confirmCodPayment);
orderRouter.post("/assign-delivery", authMiddleware, assignDelivery);

export default orderRouter;
