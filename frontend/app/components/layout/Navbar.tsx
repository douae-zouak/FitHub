"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Dumbbell,
  LogOut,
  Package,
  Heart,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { userApi } from "../../lib/api";

import { useCart } from "@/context/CartContext";

// ... (other imports remain the same, but we will assume they are there and just replace the component logic)

interface UserProfile {
  _id: string;
  email: string;
  profile: {
    name: string;
    avatar?: string;
  };
  role: string;
}

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { cartCount, wishlistCount, refreshCounts } = useCart(); // Use context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isProfileDropdownOpen &&
        !target.closest(".profile-dropdown-container")
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const profileRes = await userApi.getProfile();

        if (profileRes.success) {
          setUser(profileRes.data);
          setIsAuthenticated(true);
          refreshCounts(); // Ensure cart is fresh on auth check
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Token might be invalid
        localStorage.removeItem("token");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    refreshCounts();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/coaching", label: "Coaching" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "h-16 bg-gradient-to-b from-gray-900 to-black/95 backdrop-blur-xl shadow-2xl border-b border-gray-800"
          : "h-20 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg",
      )}
    >
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Enhanced design */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative p-2 bg-gray-900 rounded-full border border-gray-700 group-hover:border-orange-500/50 transition-colors duration-300">
                <Dumbbell className="w-6 h-6 text-orange-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent transition-all",
                  isScrolled ? "text-2xl" : "text-3xl",
                )}
              >
                FitHub
              </span>
              <span className="text-xs text-gray-400 font-medium tracking-wider">
                Strength • Fitness • Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-300 hover:text-white transition-colors font-semibold group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Enhanced */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/shop"
              className="relative p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30 group"
              title="Search products"
            >
              <Search className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link
              href="/cart"
              className="relative p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30 group"
              title="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
                  {cartCount}
                </span>
              )}
              <span className="absolute inset-0 border border-transparent group-hover:border-orange-500/20 rounded-lg transition-all duration-300"></span>
            </Link>

            <Link
              href="/wishlist"
              className="relative p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30 group"
              title="My Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${wishlistCount > 0 ? "text-pink-500 fill-pink-500" : ""}`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
                  {wishlistCount}
                </span>
              )}
              <span className="absolute inset-0 border border-transparent group-hover:border-pink-500/20 rounded-lg transition-all duration-300"></span>
            </Link>

            {isAuthenticated && user ? (
              <div className="relative profile-dropdown-container ml-2">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-3 p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30 group"
                  title="Profile"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center border-2 border-gray-800">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <span className="font-semibold">{user.profile.name}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-500 transition-transform duration-300",
                      isProfileDropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            {user.profile.name}
                          </p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-all group"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <div>
                            <span className="font-semibold">Admin Panel</span>
                            <p className="text-xs text-gray-400">
                              Manage platform
                            </p>
                          </div>
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-all group"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <div>
                          <span className="font-semibold">My Orders</span>
                          <p className="text-xs text-gray-400">
                            Track your purchases
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-all group"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        <div>
                          <span className="font-semibold">My Wishlist</span>
                          <p className="text-xs text-gray-400">Saved items</p>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-all group border-t border-gray-800 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <div>
                          <span className="font-semibold">Logout</span>
                          <p className="text-xs text-gray-400">
                            Sign out from account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white border border-gray-700 hover:border-orange-500/50 px-6 rounded-full"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg transition-colors relative"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 shadow-2xl">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-white hover:bg-gray-800/30 transition-all font-medium py-3 px-4 rounded-lg group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-800 space-y-3">
              {/* Mobile Actions */}
              <div className="flex items-center gap-3 mb-4">
                <Link
                  href="/cart"
                  className="flex-1 relative p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5 inline-block mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link
                  href="/wishlist"
                  className="flex-1 p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5 inline-block mr-2" />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
              </div>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg mb-3">
                    <p className="font-bold text-white">{user?.profile.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    className="block w-full text-center py-3 text-gray-300 hover:text-white hover:bg-gray-800/30 rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full py-3 text-white border border-gray-600 rounded-full hover:border-orange-500">
                      Sign In
                    </button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full hover:from-orange-600 hover:to-yellow-600 transition-colors font-medium">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
