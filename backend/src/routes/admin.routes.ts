import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getCustomerSegments,
  runSegmentation,
  getOrders,
  updateOrderStatus,
  getOrder,
} from "../controllers/admin.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Protect all routes
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/orders", getOrders);
router.get("/order/:id", getOrder);
router.get("/users", getAllUsers);

router.get("/segments", getCustomerSegments);
router.post("/segmentation/run", runSegmentation);

router.put("/users/:id/role", updateUserRole);
router.put("/updateOrder/:orderId", updateOrderStatus);

export default router;
