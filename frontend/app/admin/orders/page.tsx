"use client";

import { useState, useEffect } from "react";
import { adminApi } from "../../lib/api";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { cn } from "../../lib/utils";
import { Order } from "@/app/types";
import { useRouter } from "next/navigation";

export default function OrdersManagement() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.getOrders();
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  ) => {
    setUpdatingOrder(orderId);
    try {
      const response = await adminApi.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filtrer les commandes selon le statut sélectionné
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase(),
        );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Orders Management
        </h1>
        <div className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Filtre par statut */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-gray-700">
            Filter by Status:
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
              )}
            >
              Pending ({orders.filter((o) => o.status === "pending").length})
            </button>
            <button
              onClick={() => setStatusFilter("processing")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === "processing"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200",
              )}
            >
              Processing (
              {orders.filter((o) => o.status === "processing").length})
            </button>
            <button
              onClick={() => setStatusFilter("shipped")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === "shipped"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200",
              )}
            >
              Shipped ({orders.filter((o) => o.status === "shipped").length})
            </button>
            <button
              onClick={() => setStatusFilter("delivered")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === "delivered"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200",
              )}
            >
              Delivered ({orders.filter((o) => o.status === "delivered").length}
              )
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === "cancelled"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200",
              )}
            >
              Cancelled ({orders.filter((o) => o.status === "cancelled").length}
              )
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {order.user?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-bold rounded-full",
                          getStatusColor(order.status),
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* View Details Button */}
                        <button
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          title="View Details"
                          onClick={() =>
                            router.push(`/admin/orders/${order._id}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Process Order */}
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "processing")
                            }
                            disabled={updatingOrder === order._id}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-50"
                            title="Mark as Processing"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Ship Order */}
                        {(order.status === "pending" ||
                          order.status === "processing") && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "shipped")
                            }
                            disabled={updatingOrder === order._id}
                            className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors disabled:opacity-50"
                            title="Mark as Shipped"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}

                        {/* Deliver Order */}
                        {(order.status === "shipped" ||
                          order.status === "pending" ||
                          order.status === "processing") && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "delivered")
                            }
                            disabled={updatingOrder === order._id}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50"
                            title="Mark as Delivered"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}

                        {/* Complete Order */}
                        {order.status != "cancelled" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "delivered")
                            }
                            disabled={updatingOrder === order._id}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Cancel Order */}
                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order._id, "cancelled")
                              }
                              disabled={updatingOrder === order._id}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                              title="Cancel Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found for this status
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
