"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Section } from "../../../components/ui/Section";
import { ProductCard } from "../../../components/ui/ProductCard";
import { Button } from "../../../components/ui/Button";
import { Product } from "../../../types";
import { productApi, userApi } from "../../../lib/api";
import {
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Package,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

import { useCart } from "@/context/CartContext";

// ... ensure other imports are preserved

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { addToCart, toggleWishlist, isInWishlist, isAuthenticated } = useCart(); // Use context

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  useEffect(() => {
    // Update wishlist state when product or wishlist changes
    if (product) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const productResponse = await productApi.getById(id);
      if (productResponse.success) {
        setProduct(productResponse.data);
        setMainImage(productResponse.data.images[0] || "");

        try {
          const recResponse = await productApi.getRecommendations(id);
          if (recResponse.success) {
            setRecommendations(recResponse.data);
          }
        } catch (recError) {
          console.error("Error fetching recommendations:", recError);
        }
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      router.push("/auth/signin");
      return;
    }
    // Use context method which also updates state
    await addToCart(product._id);
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage your wishlist");
      router.push("/auth/signin");
      return;
    }
    // Use context method which handles toast and state updates
    await toggleWishlist(product._id);
    // Update local state for immediate UI feedback
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Section className="py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-[500px] bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded w-28" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Section className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#D6955B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-[#D6955B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#264653] mb-3">
              Product Not Found
            </h2>
            <p className="text-[#6B7280] mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/shop")}
              className="bg-[#D6955B] hover:bg-[#C08548] text-white"
            >
              Back to Shop
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Link href="/" className="hover:text-[#D6955B] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/shop"
              className="hover:text-[#D6955B] transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="w-4 h-4" />
            {product.category && (
              <>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="hover:text-[#D6955B] transition-colors"
                >
                  {product.category}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-[#264653] font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <Section className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4">
                <div className="aspect-square relative">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block px-4 py-2 bg-red-500 text-white font-bold rounded-full mb-2">
                          OUT OF STOCK
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={cn(
                        "aspect-square bg-white rounded-lg overflow-hidden border transition-all",
                        mainImage === img
                          ? "border-[#D6955B]"
                          : "border-gray-200 hover:border-[#D6955B]/50",
                      )}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-3">
                  <span className="text-xs font-bold text-[#FFFFF] uppercase tracking-wider">
                    {product.category || "Fitness"}
                  </span>
                  {product.stock > 0 && product.stock < 10 && (
                    <span className="text-xs font-medium text-[#D6955B]">
                      • Only {product.stock} left
                    </span>
                  )}
                </div>

                <h1 className="font-display font-bold text-3xl text-[#264653] mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-[#264653]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-base text-[#939597] line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full",
                      product.stock > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600",
                    )}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#264653] mb-3">
                  Description
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#264653] mb-3">
                    Key Features
                  </h3>
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#D6955B] mt-0.5 flex-shrink-0" />
                        <span className="text-[#6B7280] text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex gap-5">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 h-14 bg-[#D6955B] hover:bg-[#bf824d] text-white hover:text-white cursor-pointer font-medium rounded-lg"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </span>
                    </div>
                  </Button>
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className={cn(
                      "h-14 w-12 p-0 shrink-0 flex items-center justify-center rounded-lg border transition-all",
                      isWishlisted
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#D6955B] hover:text-[#D6955B]",
                    )}
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isWishlisted ? "fill-current" : "",
                      )}
                    />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="p-1.5 bg-gray-100 rounded-lg text-[#6B7280]">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-xs text-[#264653]">
                      Free Shipping
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="p-1.5 bg-gray-100 rounded-lg text-[#6B7280]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-xs text-[#264653]">
                      2 Year Warranty
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="p-1.5 bg-gray-100 rounded-lg text-[#6B7280]">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-xs text-[#264653]">
                      30-Day Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white py-1">
          <Section containerSize="xl">
            <div className="mb-6 text-center">
              <h2 className="text-5xl font-bold text-[#FFFFF] mb-1">
                You May Also Like
              </h2>
              <p className="text-[#6B7280] text-sm">
                Recommended products based on your selection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <ProductCard
                  key={rec._id}
                  product={rec}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isInWishlist(rec._id)}
                />
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
