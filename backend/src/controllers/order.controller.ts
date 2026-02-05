import { Request, Response } from "express";
import Order from "../models/Order.model";
import mongoose from "mongoose";

// Get logged in user orders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 }) // Newest first
      .populate("items.product", "name images price"); // Populate product details if needed

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching orders",
    });
  }
};

// Create a new order (basic implementation)

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userToken = req.user as any; // contient id et role
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    const order = await Order.create({
      user: new mongoose.Types.ObjectId(userToken.id),
      items: items.map((item: any) => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Clear the user's cart after successful order creation
    const User = (await import("../models/User.model")).default;
    await User.findByIdAndUpdate(userToken.id, { cart: [] });

    res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully! Your cart has been cleared.",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating order",
    });
  }
};
