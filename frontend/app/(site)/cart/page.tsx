"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Section, SectionHeader } from "../../components/ui/Section";
import { Button } from "../../components/ui/Button";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Shield,
  Package,
} from "lucide-react";
import { Product } from "../../types";
import { userApi } from "../../lib/api";
import { useCart } from "../../../context/CartContext";

interface CartItem {
  product: Product | null;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { refreshCounts } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);
  const validItems = cartItems.filter((item) => item.product);
  const subtotal = validItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.getCart();
      if (response.success) setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const existingItem = cartItems.find((i) => i.product?._id === productId);
    if (!existingItem) return;

    setCartItems((items) =>
      items.map((item) =>
        item.product?._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );

    try {
      await userApi.addToCart(productId, newQuantity - existingItem.quantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCart();
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await userApi.removeFromCart(productId);
      if (response.success) {
        setCartItems((items) =>
          items.filter((item) => item.product?._id !== productId),
        );
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      // Prepare order items for backend
      const orderItems = validItems.map((item) => ({
        product: item.product!._id,
        name: item.product!.name,
        price: item.product!.price,
        quantity: item.quantity,
      }));

      const response = await userApi.createOrder({
        items: orderItems,
        shippingAddress: {
          street: "Your street",
          city: "Your city",
          state: "Your state",
          zipCode: "12345",
          country: "Morocco",
        },
        paymentMethod: "cash",
        totalAmount: subtotal + shipping,
      });

      if (response.success) {
        // Clear cart locally
        setCartItems([]);
        
        // Refresh cart counts in context
        await refreshCounts();

        // Show success message
        setOrderMessage("✅ Order placed successfully! Your cart has been cleared.");

        // Redirect to shop after 2 seconds
        setTimeout(() => router.push("/shop"), 2000);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setOrderMessage("❌ Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <Section variant="default" containerSize="xl">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            accent="Your Shopping"
            title="Cart"
            subtitle={
              loading
                ? "Loading..."
                : `${validItems.length} ${validItems.length === 1 ? "item" : "items"} in your cart`
            }
          />


          {orderMessage && (
            <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 ${
              orderMessage.includes("❌") 
                ? "bg-red-500 text-white" 
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            }`}>
              <span className="text-lg font-semibold">{orderMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-neon rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          ) : validItems.length === 0 ? (
            <div className="text-center py-2">
              <div className="inline-flex p-2 rounded-2xl bg-[#121826] border border-white/20 mb-6">
                <ShoppingBag className="w-20 h-20 text-[#FFBF66]" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4 text-gray-900">
                Your cart is empty
              </h2>
              <p className="text-gray-400 mb-10 max-w-md mx-auto">
                Looks like you haven't added any items yet.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="
                  inline-flex items-center gap-3
                  px-8 py-4
                  rounded-full
                  bg-white text-black
                  font-semibold
                  hover:bg-neutral-200
                  transition
                "
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Shop
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="font-bold text-xl mb-6 text-gray-800">
                    Your Items
                  </h2>
                  <div className="space-y-4">
                    {validItems.map((item) => (
                      <div
                        key={item.product!._id}
                        className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-primary-neon/30 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex gap-4 items-center">
                          {/* Image Container */}
                          <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            {item.product!.images?.[0] ? (
                              <img
                                src={item.product!.images[0]}
                                alt={item.product!.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No image
                              </span>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                              <span className="text-xs font-semibold text-gray-700">
                                x{item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-1 text-gray-900 truncate">
                                  {item.product!.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-2">
                                  {item.product!.brand}
                                </p>
                                <p className="font-bold text-balck text-xl">
                                  {item.product!.price.toFixed(2)} MAD
                                </p>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.product!._id,
                                        item.quantity - 1,
                                      )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="px-4 py-2 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>

                                  <span className="w-12 text-center font-bold text-gray-800">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.product!._id,
                                        item.quantity + 1,
                                      )
                                    }
                                    disabled={
                                      item.quantity >= item.product!.stock
                                    }
                                    className="px-4 py-2 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {item.product!.stock} available
                                </span>
                              </div>

                              <button
                                onClick={() => removeItem(item.product!._id)}
                                className="p-3 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                                title="Remove item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Need more items?
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Discover more amazing products in our shop
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/shop")}
                      className="px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg overflow-hidden">
                    <div className="absolute top-0 left-3 rounded-xl right-3 h-1 bg-gradient-to-r from-primary-neon to-cyan-500"></div>
                    <h3 className="font-bold text-2xl mb-6 text-gray-900">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-lg">
                          {subtotal.toFixed(2)} MAD
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Shipping</span>
                          {shipping === 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              FREE
                            </span>
                          )}
                        </div>
                        <span
                          className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}
                        >
                          {shipping === 0 ? "FREE" : `${shipping}.00 MAD`}
                        </span>
                      </div>

                      {subtotal < 500 && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-bg-800">
                              Free shipping available!
                            </span>
                          </div>
                          <p className="text-xs text-blue-600">
                            Add {(500 - subtotal).toFixed(2)} MAD more to get
                            free shipping
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-semibold">
                            Total
                          </span>
                          <div className="text-right">
                            <div className="font-bold text-3xl text-primary-neon-dark">
                              {total.toFixed(2)} MAD
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Including all taxes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout} // <-- ici
                      className="w-full group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-[#B67332] to-[#B67332] text-white font-bold hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FFA726] to-[#FFBF66] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center gap-3">
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                      By completing your purchase, you agree to our Terms of
                      Service
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Secure payment
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          30-day returns
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
