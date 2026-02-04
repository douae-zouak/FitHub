import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitHub - Your Fitness Journey, Elevated",
  description:
    "Premium fitness equipment and personalized coaching to transform your fitness journey",
  keywords: ["fitness", "gym equipment", "coaching", "workout", "health"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-white text-black`}
    >
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
