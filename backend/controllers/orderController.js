import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order via Stripe
// Flow: pre-generate orderId → create Stripe session → save order with sessionId → return session URL
// This way a failed Stripe call never leaves an orphan order in the DB
const placeOrderStripe = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const { items, amount, address, deliveryFee = 0 } = req.body;

  try {
    const orderId = new mongoose.Types.ObjectId();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "pkr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "pkr",
          product_data: { name: "Delivery Charges" },
          unit_amount: deliveryFee * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${orderId}`,
      cancel_url:  `${frontendUrl}/verify?success=false&orderId=${orderId}`,
    });

    const newOrder = new orderModel({
      _id: orderId,
      userId: req.body.userId || "guest",
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      stripeSessionId: session.id,
    });
    await newOrder.save();

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating payment session" });
  }
};

// verify Stripe payment — re-checks with Stripe API using the stored sessionId
// so the result cannot be faked by manipulating the redirect URL
const verifyOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

    if (session.payment_status === "paid") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      if (order.userId && order.userId !== "guest") {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// placing user order (COD only — Stripe checkout removed from frontend)
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: "COD",
      payment: false,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    return res.json({ success: true, cod: true, orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Confirm COD payment (mark as paid)
const confirmCodPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.json({ success: true, message: "Order marked as paid (COD)" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Assign delivery person
const assignDelivery = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        delivery: {
          assigned: true,
          person: req.body.person,
          status: "Assigned"
        }
      });
      res.json({ success: true, message: "Delivery assigned" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    }else{
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, placeOrderStripe, verifyOrder, userOrders, listOrders, updateStatus, confirmCodPayment, assignDelivery };
