import { Router } from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
  getRecommendations,
} from "../controllers/product.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/:id", getProductById);
router.get("/:id/recommendations", getRecommendations);

// Admin routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
