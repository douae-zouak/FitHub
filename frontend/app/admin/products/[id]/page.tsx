"use client";

import { useState, useEffect, use } from "react";
import ProductForm from "../components/ProductForm";
import { productApi } from "../../../lib/api";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getById(id);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500">Product not found</div>
    );
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
