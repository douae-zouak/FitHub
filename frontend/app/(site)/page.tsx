"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Main Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Fitness Image - Using inline styles for direct image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1920')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Transparent Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
              Welcome to <span className="text-[#FEEAA1]">FitHub</span>
            </h1>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-8">
              <p className="text-white/90 text-lg md:text-xl text-center leading-relaxed">
                Your premier destination for fitness excellence. We combine premium equipment 
                with expert coaching to help you achieve your goals. Whether you're starting 
                your fitness journey or looking to elevate your training, we provide everything 
                you need to succeed.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/shop")}
                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/about")}
                className="px-8 py-3 bg-[#FEEAA1] text-gray-900 font-bold rounded-lg hover:bg-[#FEEAA1]/90 transition-colors"
              >
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}