import { Request, Response } from "express";
import Product from "../models/Product.model";

// Get all products with filters, search, and pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      featured,
      sort = "-createdAt",
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (featured) filter.featured = featured === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({ featured: true })
      .limit(limit)
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured products",
      error: error.message,
    });
  }
};

// Get categories with product counts
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get brands with product counts
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Product.aggregate([
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: brands,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching brands",
      error: error.message,
    });
  }
};

// Create product (admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error,
    });
  }
};

// Update product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Get product recommendations
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = Number(req.query.limit) || 5;

    // 1. Get the product to find its SKU
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Call ML Service
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    try {
      const axios = require("axios");
      const mlResponse = await axios.post(`${mlServiceUrl}/api/ml/recommend`, {
        sku: product.sku,
        limit,
      });

      if (mlResponse.data.success && mlResponse.data.recommendations) {
        const recommendedSkus = mlResponse.data.recommendations.map(
          (rec: any) => rec.sku,
        );

        // 3. Fetch products from MongoDB
        const recommendations = await Product.find({
          sku: { $in: recommendedSkus },
        });

        // Sort to match recommendation order if possible, or just return
        // Doing a simple return for now

        return res.json({
          success: true,
          data: recommendations,
        });
      }
    } catch (mlError) {
      console.error("ML Service Error:", mlError);
      // Fallback: Return products from same category
      const fallbackRecommendations = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
      }).limit(limit);

      return res.json({
        success: true,
        data: fallbackRecommendations,
        source: "fallback",
      });
    }

    // Default fallback if ML service fails silently or returns no data
    // const fallbackRecommendations = await Product.find({
    //   category: product.category,
    //   _id: { $ne: product._id },
    // }).limit(limit);

    // res.json({
    //   success: true,
    //   data: fallbackRecommendations,
    //   source: "fallback",
    // });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};
