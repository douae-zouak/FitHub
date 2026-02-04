"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { Section, SectionHeader } from "../../components/ui/Section";
import { Product } from "../../types";
import { productApi, userApi } from "../../lib/api";
import { Search, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useCart } from "@/context/CartContext";

// ... ensure other imports are handled

export default function ShopPage() {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, isAuthenticated } = useCart(); // Use context

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery, sortBy, page]);

  const fetchFilters = async () => {
    const [catRes, brandRes] = await Promise.all([
      productApi.getCategories(),
      productApi.getBrands(),
    ]);
    if (catRes.success) setCategories(catRes.data);
    if (brandRes.success) setBrands(brandRes.data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const params: any = { page, limit: 20, sort: sortBy };
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (searchQuery) params.search = searchQuery;

    const res = await productApi.getAll(params);
    if (res.success) {
      setProducts(res.data);
      setTotalPages(res.pagination.pages);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchQuery("");
    setSortBy("-createdAt");
    setPage(1);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return router.push("/auth/signin");
    }
    
    // Use context method which also updates state
    await addToCart(product._id);
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage your wishlist");
      return router.push("/auth/signin");
    }
    // Use context method which handles toast and state updates
    await toggleWishlist(product._id);
  };

  return (
    <div className="min-h-screen ">
      <Section variant="default" containerSize="xl" className="pt-8">
        {/* 🔹 HEADER – plus compact */}
        <SectionHeader
          accent="Shop"
          title="All Products"
          subtitle={
            <span className="text-[#6B7280] font-medium">
              Premium fitness equipment, curated for you
            </span>
          }
          className="mb-8"
        />

        {/* 🔍 FILTER BAR – sans bordure, couleurs élégantes */}
        <div className="mb-12 rounded-2xl bg-gray-200  py-2 px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Search
              </label>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className=" text-black border-2
                  w-full pl-10 pr-4 py-3
                  rounded-xl
                  bg-white/80 dark:bg-white/5
                  backdrop-blur
                  text-sm
                  outline-none
                  focus:ring-2 focus:ring-[#7C9DFF]/40
                "
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="
              text-black
              border-2 
                w-full px-4 py-3 rounded-xl
                bg-white/80 dark:bg-white/5
                backdrop-blur
                text-sm
                outline-none
                focus:ring-2 focus:ring-[#7C9DFF]/40
              "
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c._id}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className=" text-black border-2
                w-full px-4 py-3 rounded-xl
                bg-white/80 dark:bg-white/5
                backdrop-blur
                text-sm
                outline-none
                focus:ring-2 focus:ring-[#7C9DFF]/40
              "
              >
                <option value="">All</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b._id}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className=" text-black border-2
                w-full px-4 py-3 rounded-xl
                bg-white/80 dark:bg-white/5
                backdrop-blur
                text-sm
                outline-none
                focus:ring-2 focus:ring-[#7C9DFF]/40
              "
              >
                <option value="-createdAt">Newest</option>
                <option value="price">High Price</option>
                <option value="-price">Low Price</option>
                <option value="-rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer transition"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* 🛒 PRODUCTS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-dark-bg-tertiary animate-pulse"
              />
            ))}
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isInWishlist(p._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <SlidersHorizontal className="mx-auto mb-4 w-10 h-10 text-gray-400" />
            <p className="text-gray-500 mb-4">No products found</p>
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {/* 🔢 PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="
        w-10 h-10 flex items-center justify-center
        rounded-lg
        bg-white text-gray-600
        hover:bg-gray-100
        disabled:opacity-40 disabled:cursor-not-allowed
        transition
      "
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`
            w-10 h-10 rounded-lg text-sm font-semibold transition
            ${
              p === page
                ? "bg-[#7C9DFF] text-white shadow"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }
          `}
                >
                  {p}
                </button>
              ))}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="
        w-10 h-10 flex items-center justify-center
        rounded-lg
        bg-white text-gray-600
        hover:bg-gray-100
        disabled:opacity-40 disabled:cursor-not-allowed
        transition
      "
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
