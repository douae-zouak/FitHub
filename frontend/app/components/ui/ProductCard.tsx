"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean; // Receive wishlist state from parent
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false, // Default to false if not provided
}) => {
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";



  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  return (
    <Link href={`/shop/${product._id}`} className="block h-full">
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#D6955B]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#D6955B]/5 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={mainImage}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />

          {/* CATÉGORIE EN HAUT DE LA CARTE */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg- backdrop-blur-lg text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
              {product.category || "Fitness"}
            </span>
          </div>

          {/* Overlay with Actions */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                isWishlisted
                  ? "bg-red-500/20 border border-red-500/30 text-red-400"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }`}
              title="Add to Wishlist"
            >
              <Heart
                className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3 rounded-full bg-[#D6955B] text-white hover:bg-[#C08548] transition-all duration-300 transform hover:scale-110 shadow-lg"
              title="Add to Cart"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Titre */}
          <h3
            className="
            font-display font-bold text-lg
            text-[#264653]
            mb-3 line-clamp-2
          "
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-[#6B7280] text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            {/* Prix */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#264653]">
                ${product.price ? product.price.toFixed(2) : "0.00"}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-sm text-[#939597] line-through mt-1">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex flex-col items-end">
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  product.stock > 0
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {product.stock > 0 && product.stock < 10 && (
                <span className="text-xs text-[#D6955B] font-medium mt-1">
                  Only {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Effet de bordure subtil au survol */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D6955B]/20 rounded-2xl transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};
