"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "../app/lib/api";
import { toast } from "react-hot-toast";

interface CartContextType {
  cartCount: number;
  wishlistCount: number;
  wishlistItems: Set<string>; // Track wishlist product IDs
  isAuthenticated: boolean; // Track authentication state
  refreshCounts: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean; // Check if product is in wishlist
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshCounts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistItems(new Set());
      setIsAuthenticated(false);
      return;
    }

    try {
      const [cartRes, wishlistRes] = await Promise.all([
        userApi.getCart(),
        userApi.getWishlist(),
      ]);

      if (cartRes.success) {
        setCartCount(cartRes.data.length);
        setIsAuthenticated(true);
      }
      if (wishlistRes.success) {
        setWishlistCount(wishlistRes.data.length);
        // Extract product IDs from wishlist
        const ids = new Set<string>(wishlistRes.data.map((item: any) => (item.product?._id || item.product) as string));
        setWishlistItems(ids);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
      // If error, token might be invalid
      setIsAuthenticated(false);
    }
  };

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await userApi.addToCart(productId, 1); // Pass quantity parameter
      toast.success("Added to cart");
      await refreshCounts();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await userApi.removeFromCart(productId);
      toast.success("Removed from cart");
      await refreshCounts();
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
      throw error; 
    }
  };

  const toggleWishlist = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const wasInWishlist = wishlistItems.has(productId);

    // Optimistic update - update UI immediately
    const newWishlistItems = new Set(wishlistItems);
    if (wasInWishlist) {
      newWishlistItems.delete(productId);
      setWishlistCount(prev => Math.max(0, prev - 1));
    } else {
      newWishlistItems.add(productId);
      setWishlistCount(prev => prev + 1);
    }
    setWishlistItems(newWishlistItems);

    try {
      await userApi.toggleWishlist(productId);
      
      // Show appropriate toast message
      if (wasInWishlist) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
      
      // Refresh from backend to ensure consistency
      await refreshCounts();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
      // Revert optimistic update on error
      setWishlistItems(wishlistItems);
      setWishlistCount(wasInWishlist ? wishlistCount : wishlistCount - 1);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.has(productId);
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      wishlistCount,
      wishlistItems,
      isAuthenticated,
      refreshCounts, 
      addToCart, 
      removeFromCart,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
