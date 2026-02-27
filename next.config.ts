import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
                    // Referrer policy — send origin on cross-origin, full on same-origin
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    // Permissions policy — disable unused browser features
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), payment=()",
                    },
                    // Strict Transport Security — force HTTPS for 1 year
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                    // Content Security Policy — restrictive but functional
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.lordicon.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self' data:",
                            "connect-src 'self' https://cdn.lordicon.com",
                            "frame-src 'self' https://www.google.com https://maps.google.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join("; "),
                    },
                ],
            },
        ];
    },

    // Optimize server external packages
    serverExternalPackages: ["pdfkit", "nodemailer"],
};

export default nextConfig;
