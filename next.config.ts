import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
    transpilePackages: ["lucide-react"],

    turbopack: {
        root: path.resolve(__dirname),
    },

    // Image optimization — allow local images and future CDN/backend sources
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.haitechmedical.com.au",
            },
            {
                protocol: "https",
                hostname: "**.haitech-group.com",
            },
            {
                // Google profile pictures
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                // Cloudinary-hosted product media
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },

    // Security headers for all routes
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    // Prevent clickjacking
                    { key: "X-Frame-Options", value: "DENY" },
                    // Prevent MIME-type sniffing
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    // Referrer policy
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    // Permissions policy — payment= and accelerometer= must stay open
                    // because Razorpay uses the Payment Request API and device fingerprinting
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), accelerometer=*, payment=*",
                    },
                    // Strict Transport Security (HTTPS only — production)
                    ...(!isDev ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }] : []),
                    // Cross-Origin-Opener-Policy — use unsafe-none so Google's postMessage
                    // (OAuth popup) can communicate back to the opener window
                    { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
                    // Content Security Policy
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            // Google Identity Services + Razorpay (checkout + CDN assets) + GA4
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.lordicon.com https://accounts.google.com https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com",
                            "style-src 'self' 'unsafe-inline' https://accounts.google.com",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self' data:",
                            // Allow backend API, Google OAuth, Razorpay API, and GA4 calls
                            [
                                "connect-src 'self'",
                                isDev ? "http://localhost:5000" : "",
                                "https://cdn.lordicon.com",
                                "https://accounts.google.com",
                                "https://oauth2.googleapis.com",
                                "https://www.googleapis.com",
                                "https://api.razorpay.com",
                                "https://cdn.razorpay.com",
                                "https://lumberjack.razorpay.com",
                                "https://www.googletagmanager.com",
                                "https://www.google-analytics.com",
                                "https://analytics.google.com",
                                "https://*.google-analytics.com",
                            ].filter(Boolean).join(" "),
                            // Google + Razorpay iframes
                            "frame-src 'self' https://www.google.com https://maps.google.com https://accounts.google.com https://api.razorpay.com https://checkout.razorpay.com https://workdrive.zohoexternal.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join("; "),
                    },
                ],
            },
        ];
    },

    // URL redirects — keep old paths alive for SEO/bookmarks
    async redirects() {
        return [
            {
                source: "/our-instruments",
                destination: "/product-category/medesy",
                permanent: true,
            },
            {
                source: "/our-instruments/:path*",
                destination: "/product-category/medesy/:path*",
                permanent: true,
            },
        ];
    },

    // Optimize server external packages
    serverExternalPackages: ["pdfkit", "nodemailer"],
};

export default nextConfig;
