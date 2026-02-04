import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    neon: '#39FF14',
                    'neon-dark': '#2DD10F',
                    'neon-light': '#5FFF3D',
                },
                secondary: {
                    electric: '#00D9FF',
                    'electric-dark': '#00B8DB',
                    'electric-light': '#33E3FF',
                },
                accent: {
                    orange: '#FF6B35',
                    'orange-dark': '#E55A2B',
                    'orange-light': '#FF8558',
                },
                dark: {
                    bg: {
                        primary: '#0A0E27',
                        secondary: '#1A1F3A',
                        tertiary: '#252B4A',
                    },
                    text: {
                        primary: '#FFFFFF',
                        secondary: '#B8C1EC',
                    },
                    border: 'rgba(255, 255, 255, 0.1)',
                },
                light: {
                    bg: {
                        primary: '#F8F9FA',
                        secondary: '#FFFFFF',
                        tertiary: '#E9ECEF',
                    },
                    text: {
                        primary: '#212529',
                        secondary: '#6C757D',
                    },
                    border: 'rgba(0, 0, 0, 0.1)',
                },
            },
            fontFamily: {
                display: ['var(--font-outfit)', 'sans-serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            boxShadow: {
                'neon-sm': '0 0 10px rgba(57, 255, 20, 0.3)',
                'neon-md': '0 0 20px rgba(57, 255, 20, 0.4)',
                'neon-lg': '0 0 40px rgba(57, 255, 20, 0.5)',
                'electric-sm': '0 0 10px rgba(0, 217, 255, 0.3)',
                'electric-md': '0 0 20px rgba(0, 217, 255, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
