"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminApi, productApi } from "../../../lib/api";
import { Button } from "@/app/components/ui/Button";
import { ChevronLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    sku: "",
    images: [""] as string[],
    featured: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        stock: initialData.stock?.toString() || "",
        sku: initialData.sku || "",
        images: initialData.images?.length ? initialData.images : [""],
        featured: initialData.featured || false,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: newImages.length ? newImages : [""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter((img) => img.trim() !== ""),
      };

      console.log("Submitting product data:", productData);
      if (isEditing && initialData?._id) {
        await adminApi.updateProduct(initialData._id, productData);
        toast.success("Product updated successfully");
      } else {
        await adminApi.createProduct(productData);
        toast.success("Product created successfully");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      const errResponse = error.response?.data?.error?.errorResponse;
      if (errResponse?.code === 11000) {
        // Duplication SKU
        toast.error(`Duplicated SKU (${errResponse.keyValue.sku})`);
      } else {
        // Autres erreurs
        toast.error("Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
              placeholder="e.g. Premium Yoga Mat"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
              placeholder="e.g. YOGA-001"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Category</option>
              <option value="exterieur">exterieur</option>
              <option value="chaussures_hommes">chaussures_hommes</option>
              <option value="accessoires_hommes">accessoires_hommes</option>
              <option value="bebe">bebe</option>
              <option value="chaussures_enfants">chaussures_enfants</option>
              <option value="decathlon_chaussures_femmes">decathlon_chaussures_femmes</option>
              <option value="materiels-enfants">materiels-enfants</option>
              <option value="nutrition-et-soin">nutrition-et-soin</option>
              <option value="vetements-enfants">vetements-enfants</option>
              <option value="vetements-femmes">vetements-femmes</option>
              <option value="vetements-hommes">vetements-hommes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
              placeholder="e.g. Nike, Adidas"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
            placeholder="Detailed product description..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Product Images (URLs)
          </label>
          {formData.images.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 text-gray-800 px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-transparent outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-sm text-blue-600 cursor-pointer font-medium hover:underline flex items-center gap-1"
          >
            <Upload className="w-4 h-4" /> Add another image URL
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-primary-neon border-gray-500 rounded focus:ring-primary-neon"
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-gray-700"
          >
            Featured Product
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/products">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
        </Link>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
