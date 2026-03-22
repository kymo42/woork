import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.firebase.storage.googleapis.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
};

// Only import cloudflare adapter in development
if (process.env.NODE_ENV === 'development') {
    import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}

export default nextConfig;
