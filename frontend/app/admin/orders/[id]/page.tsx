"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "../../../lib/api";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Order } from "@/app/types";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await adminApi.getOrder(orderId);
      if (response.success) {
        setOrder(response.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  ) => {
    setUpdatingStatus(true);
    try {
      const response = await adminApi.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrder((prevOrder) =>
          prevOrder ? { ...prevOrder, status: newStatus } : null,
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "processing":
        return <Package className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Order Not Found
        </h2>
        <button
          onClick={() => router.push("/admin/orders")}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/orders")}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Order Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-full border-2 flex items-center gap-2 font-bold",
            getStatusColor(order.status),
          )}
        >
          {getStatusIcon(order.status)}
          <span className="uppercase text-sm">{order.status}</span>
        </div>
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Update Order Status
        </h2>
        <div className="flex gap-3 flex-wrap">
          {order.status === "pending" && (
            <button
              onClick={() => updateOrderStatus("processing")}
              disabled={updatingStatus}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              <Clock className="w-4 h-4" />
              Mark as Processing
            </button>
          )}

          {(order.status === "pending" || order.status === "processing") && (
            <button
              onClick={() => updateOrderStatus("shipped")}
              disabled={updatingStatus}
              className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              <Package className="w-4 h-4" />
              Mark as Shipped
            </button>
          )}

          {(order.status === "shipped" ||
            order.status === "pending" ||
            order.status === "processing") && (
            <button
              onClick={() => updateOrderStatus("delivered")}
              disabled={updatingStatus}
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              <Truck className="w-4 h-4" />
              Mark as Delivered
            </button>
          )}

          {order.status !== "cancelled" && order.status !== "delivered" && (
            <button
              onClick={() => updateOrderStatus("cancelled")}
              disabled={updatingStatus}
              className="px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              <XCircle className="w-4 h-4" />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.user?.email || "Unkown"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
                  {order.shippingAddress.street} -{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product?.name || "Product"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${item.price?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${(item.price * item.quantity).toFixed(2)} total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">
                  {order.totalAmount?.toFixed(2) || "0.00"} DH
                </span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Order Information
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              {order.updatedAt && (
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {order.paymentMethod && (
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
              )}
              {order.paymentStatus && (
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.paymentStatus}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    order.status === "pending" ||
                      order.status === "processing" ||
                      order.status === "shipped" ||
                      order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400",
                  )}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    Order Placed
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    order.status === "processing" ||
                      order.status === "shipped" ||
                      order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "pending"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400",
                  )}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    Processing
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.status === "processing" ||
                    order.status === "shipped" ||
                    order.status === "delivered"
                      ? "Completed"
                      : "Pending"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    order.status === "shipped" || order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "processing"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-400",
                  )}
                >
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Shipped</p>
                  <p className="text-xs text-gray-500">
                    {order.status === "shipped" || order.status === "delivered"
                      ? "Completed"
                      : "Pending"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "shipped"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-400",
                  )}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">Delivered</p>
                  <p className="text-xs text-gray-500">
                    {order.status === "delivered" ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>

              {order.status === "cancelled" && (
                <div className="flex gap-3 pt-2 border-t border-gray-200">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Order Cancelled
                    </p>
                    <p className="text-xs text-gray-500">
                      This order has been cancelled
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
