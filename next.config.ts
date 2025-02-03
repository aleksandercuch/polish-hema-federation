import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["firebasestorage.googleapis.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdsw.pl",
                port: "",
                pathname: "/wp-content/uploads/**",
            },
        ],
    },
};

export default nextConfig;
