"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Section, SectionHeader } from "../../components/ui/Section";
import { ProductCard } from "../../components/ui/ProductCard";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "../../types";
import { userApi } from "../../lib/api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist, isAuthenticated } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.getWishlist();
      if (response.success) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
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
    // Use context method which updates navbar count
    await addToCart(product._id);
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage your wishlist");
      router.push("/auth/signin");
      return;
    }
    
    // Use context method which updates navbar count and icon
    await toggleWishlist(product._id);
    
    // Remove from local list immediately for better UX
    setWishlistItems((items) =>
      items.filter((item) => item._id !== product._id),
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <Section variant="default" containerSize="lg">
        <SectionHeader
          accent="Favorites"
          title="Wishlist"
          subtitle={
            loading
              ? "Loading..."
              : `${wishlistItems.length} item(s) saved`
          }
        />

        {/* EMPTY STATE */}
        {!loading && wishlistItems.length === 0 && (
          <div className="text-center py-2">
            <div className="inline-flex p-5 rounded-2xl bg-[#121826] border border-white/20 mb-6">
              <Heart className="w-20 h-20 text-[#FFBF66]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>


            <p className="text-gray-400 mb-10 max-w-md mx-auto">
              Save your favorite products here and come back anytime.
            </p>

            <button
              onClick={() => router.push("/shop")}
              className="
                inline-flex items-center gap-3
                px-8 py-4
                rounded-full
                bg-white text-black
                font-semibold
                border border-bg
                hover:bg-neutral-200
                transition
              "
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Shop
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!loading && wishlistItems.length > 0 && (
          <>
            {/* ACTION BAR */}
            <div className="mb-10 p-3 rounded-2xl bg-[#F0EEE9] border border-white/25">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#F7F6CF]/10 border border-[#F7F6CF]/30">
                    <Heart className="w-6 h-6 text-[#FFBF66] fill-[#FFBF66]" />
                  </div>
                  <div>
                    <h3 className="text-bg font-semibold">
                      Wishlist summary
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {wishlistItems.length} items
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* SECONDARY BUTTON */}
                  <button
                    onClick={() => router.push("/shop")}
                    className="
                      px-6 py-2.5
                      rounded-full
                      bg-white text-black
                      border border-white
                      hover:bg-neutral-200
                      transition
                      flex items-center gap-2
                    "
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add more
                  </button>

                  {/* PRIMARY BUTTON */}
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Add all ${wishlistItems.length} items to cart?`,
                        )
                      ) {
                        wishlistItems.forEach(handleAddToCart);
                      }
                    }}
                    className="
                      px-6 py-2.5
                      rounded-full
                      bg-white text-black
                      font-medium
                      border border-white
                      hover:bg-neutral-200
                      transition
                    "
                  >
                    Add all to cart
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={isInWishlist(product._id)}
                />
              ))}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
