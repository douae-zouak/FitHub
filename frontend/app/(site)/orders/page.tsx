"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Section, SectionHeader } from "../../components/ui/Section";
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import { userApi } from "../../lib/api";
import { cn } from "../../lib/utils";
import Link from "next/link";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  } | null;
  name: string; // Fallback name if product is deleted
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  paymentStatus: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.getOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "processing":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "shipped":
        return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      case "delivered":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "cancelled":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Section variant="default" containerSize="lg">
      <SectionHeader
        accent="Order History"
        title="My Orders"
        subtitle={
          loading
            ? "Loading..."
            : `You have placed ${orders.length} ${orders.length === 1 ? "order" : "orders"}`
        }
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-dark-bg-tertiary rounded-2xl p-6 border border-dark-border animate-pulse h-40"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-dark-bg-tertiary rounded-2xl border border-dark-border">
          <ShoppingBag className="w-24 h-24 text-dark-text-secondary mx-auto mb-6" />
          <h2 className="font-display font-bold text-2xl mb-4">
            No orders yet
          </h2>
          <p className="text-dark-text-secondary mb-8">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-neon text-dark-bg-primary font-bold rounded-lg hover:bg-primary-neon-light transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-dark-bg-tertiary rounded-2xl border border-dark-border overflow-hidden group hover:border-primary-neon/50 transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-bg-primary rounded-xl">
                      <Package className="w-6 h-6 text-primary-neon" />
                    </div>
                    <div>
                      <p className="text-sm text-dark-text-secondary mb-1">
                        Order ID
                      </p>
                      <p className="font-mono text-sm font-semibold text-dark-text-primary">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-dark-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium border",
                        getStatusColor(order.status),
                      )}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-t border-dark-border/50 first:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-dark-bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product?.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-dark-text-secondary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-text-primary">
                            {item.name}
                          </p>
                          <p className="text-sm text-dark-text-secondary">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-dark-text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-bg-secondary px-6 py-4 border-t border-dark-border flex items-center justify-between">
                <div>
                  <span className="text-dark-text-secondary mr-2">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-white">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <button className="text-primary-neon font-semibold hover:text-white transition-colors flex items-center gap-1">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
