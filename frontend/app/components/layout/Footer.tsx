'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
    const footerLinks = {
        shop: [
            { label: 'All Products', href: '/shop' },
            { label: 'New Arrivals', href: '/shop?filter=new' },
            { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Shipping Info', href: '/shipping' },
            { label: 'Returns', href: '/returns' },
        ],
        company: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Blog', href: '/blog' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer - Compact */}
                <div className="py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                        {/* Brand */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="relative p-2 bg-gray-900 rounded-full border border-gray-700 group-hover:border-orange-500/50 transition-colors">
                                    <Dumbbell className="w-5 h-5 text-orange-400" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent text-xl">
                                    FitHub
                                </span>
                                <span className="text-xs text-gray-400">
                                    Train • Elevate • Conquer
                                </span>
                            </div>
                        </Link>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid - Compact */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        {Object.entries(footerLinks).map(([category, links]) => (
                            <div key={category}>
                                <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                                    {category}
                                </h3>
                                <ul className="space-y-2">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-gray-400 hover:text-white text-sm transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} FitHub. All rights reserved.
                            </p>
                            <div className="flex gap-4">
                                <Link 
                                    href="/privacy" 
                                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                                >
                                    Privacy
                                </Link>
                                <Link 
                                    href="/terms" 
                                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                                >
                                    Terms
                                </Link>
                                <Link 
                                    href="/cookies" 
                                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                                >
                                    Cookies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};