import { Request, Response } from "express";
import { execFile } from "child_process";
import path from "path";
import fs from "fs";

import User from "../models/User.model";
import Product from "../models/Product.model";
// We need to import Order model, assuming it's default export
import Order from "../models/Order.model";
import CustomerSegment from "../models/CustomerSegment";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const orders = await Order.find({ paymentStatus: "completed" });
    const totalRevenue = orders.reduce(
      (acc, order) => acc + (order.totalAmount || 0),
      0,
    );

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "email");

    res.json({
      success: true,
      stats: {
        users: totalUsers,
        products: totalProducts,
        orders: totalOrders,
        revenue: totalRevenue,
      },
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "email");

    res.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("user", "email");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(orderId as string);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    order.status = status as
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled";
    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};

export const getCustomerSegments = async (req: Request, res: Response) => {
  const result = await CustomerSegment.aggregate([
    {
      $group: {
        _id: "$cluster",
        count: { $sum: 1 },
        avgSales: { $avg: "$sales" },
        avgFrequency: { $avg: "$frequency" },
        avgRecency: { $avg: "$recency" },
        lastUpdate: { $max: "$updatedAt" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.json(result);
};

export const runSegmentation = async (req: Request, res: Response) => {
  try {
    // Chemin absolu correct vers ml-service (à la racine du projet)
    const cwd = path.resolve(__dirname, "..", "..", "..", "ml-service", "customer_segmentation");
    const scriptPath = path.resolve(cwd, "segmentation.py");
    const pythonPath = path.resolve(cwd, "segenv", "Scripts", "python.exe");

    // Vérifier que les fichiers existent
    if (!fs.existsSync(pythonPath)) {
      return res.status(500).json({
        success: false,
        message: "Python executable not found",
        error: `Python not found at: ${pythonPath}`,
        hint: "Make sure the virtual environment 'segenv' is created",
      });
    }

    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({
        success: false,
        message: "Python script not found",
        error: `Script not found at: ${scriptPath}`,
      });
    }
    // Utiliser execFile qui n'a pas besoin de cmd.exe
    execFile(
      pythonPath,
      [scriptPath],
      {
        cwd,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        timeout: 300000, // 5 minutes timeout
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);
          return res.status(500).json({
            success: false,
            message: "Segmentation failed",
            error: error.message,
          });
        }

        return res.json({
          success: true,
          message: "Segmentation executed successfully",
          logs: stdout,
          warnings: stderr || undefined,
        });
      },
    );
  } catch (error: any) {
    console.error("Segmentation setup error:", error);
    return res.status(500).json({
      success: false,
      message: "Segmentation setup failed",
      error: error.message,
    });
  }
};
