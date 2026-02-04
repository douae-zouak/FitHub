"use client";

import { useEffect, useState } from "react";
import { adminApi } from "../../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CustomerSegmentStats } from "../../types";
import { Button } from "@/app/components/ui";
import toast from "react-hot-toast";

const CLUSTER_LABELS: Record<number, string> = {
  0: "Low-Value",
  1: "Core",
  2: "At-Risk",
  3: "Loyal",
  4: "Casual VIPs",
  5: "At-Risk VIPs",
  6: "Super Buyers",
};

const CLUSTER_COLORS: Record<number, string> = {
  0: "#EF4444", // Red
  1: "#3B82F6", // Blue
  2: "#F59E0B", // Amber
  3: "#10B981", // Green
  4: "#8B5CF6", // Purple
  5: "#F97316", // Orange
  6: "#14B8A6", // Teal
};

const CLUSTER_DESCRIPTIONS: Record<number, string> = {
  0: "Low-value customers - Require special attention",
  1: "Regular customers - Solid business foundation",
  2: "At-risk customers - Re-engagement campaigns needed",
  3: "Loyal customers - Maintain relationship",
  4: "Occasional VIPs - Engagement potential",
  5: "At-risk VIPs - Immediate action required",
  6: "Super buyers - Premium loyalty programs",
};

export default function AdminAnalysisPage() {
  const [segments, setSegments] = useState<CustomerSegmentStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getCustomerSegments();
      setSegments(
        data.map((s: CustomerSegmentStats) => ({
          ...s,
          name: CLUSTER_LABELS[s._id] ?? `Cluster ${s._id}`,
          salesPer100: s.avgSales / 100,
          color: CLUSTER_COLORS[s._id] ?? "#6B7280",
          description: CLUSTER_DESCRIPTIONS[s._id] ?? "",
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!confirm("Run segmentation? This may take a few minutes.")) {
      return;
    }

    try {
      setRefreshing(true);
      await adminApi.runSegmentation();
      toast.success("✅ Segmentation started. Reloading data in 10 seconds...");

      setTimeout(() => {
        loadData();
      }, 10000);
    } catch (err) {
      toast.error(
        "❌ Error: " + (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Statistical calculations
  const totalCustomers = segments.reduce((sum, s) => sum + s.count, 0);
  const avgSales =
    segments.reduce((sum, s) => sum + s.avgSales * s.count, 0) /
      totalCustomers || 0;
  const avgFrequency =
    segments.reduce((sum, s) => sum + s.avgFrequency * s.count, 0) /
      totalCustomers || 0;
  const avgRecency =
    segments.reduce((sum, s) => sum + s.avgRecency * s.count, 0) /
      totalCustomers || 0;

  const lastUpdate =
    segments.length > 0
      ? new Date(segments[0].lastUpdate).toLocaleString("en-US")
      : "—";

  // Data for radar chart
  const radarData = segments.map((s) => ({
    segment: s.name,
    Sales: (s.avgSales / 1000).toFixed(1), // in thousands
    Frequency: s.avgFrequency,
    Recency: Math.max(0, 365 - s.avgRecency), // Invert so higher = better
  }));

  if (loading && segments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold text-lg">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Segmentation Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdate}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Running..." : "Run Segmentation"}
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">
            {totalCustomers.toLocaleString()}
          </p>
          <p className="text-sm opacity-75 mt-1">
            {segments.length} active segments
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Average Sales</h3>
          <p className="text-3xl font-bold mt-2">{avgSales.toFixed(0)} DH</p>
          <p className="text-sm opacity-75 mt-1">Per customer</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Average Frequency</h3>
          <p className="text-3xl font-bold mt-2">{avgFrequency.toFixed(1)}</p>
          <p className="text-sm opacity-75 mt-1">Orders per customer</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Average Recency</h3>
          <p className="text-3xl font-bold mt-2">
            {avgRecency.toFixed(0)} days
          </p>
          <p className="text-sm opacity-75 mt-1">Since last order</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Customer Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segments}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customers per Segment */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Customers per Segment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={segments}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                name="Number of customers"
                radius={[8, 8, 0, 0]}
              >
                {segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RFM Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            RFM Analysis by Segment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="segment" fontSize={10} />
              <PolarRadiusAxis />
              <Radar
                name="Sales (k DH)"
                dataKey="Sales"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Radar
                name="Frequency"
                dataKey="Frequency"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
              <Radar
                name="Recency"
                dataKey="Recency"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Evolution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Metrics Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={segments}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgFrequency"
                name="Frequency"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgRecency"
                name="Recency (days)"
                stroke="#F59E0B"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="salesPer100"
                name="Sales / 100"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Segment Details
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Sales
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recency
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {segments.map((segment) => (
                <tr
                  key={segment._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {segment.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    {segment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                    {segment.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {segment.avgSales.toFixed(0)} DH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {segment.avgFrequency.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {segment.avgRecency.toFixed(0)} d
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {((segment.count / totalCustomers) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-sm font-semibold text-gray-900"
                >
                  TOTAL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {totalCustomers.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {avgSales.toFixed(0)} DH
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {avgFrequency.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {avgRecency.toFixed(0)} d
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
