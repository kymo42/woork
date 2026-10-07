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

export default nextConfig;

// Enables the OpenNext Cloudflare bindings during `next dev`, so local
// development matches what Cloudflare Workers runs. Guarded so a plain
// `next build` or `next dev` still works if the adapter isn't installed.
import('@opennextjs/cloudflare')
    .then((m) => m.initOpenNextCloudflareForDev())
    .catch(() => {
        /* @opennextjs/cloudflare not installed - plain Next.js mode */
    });
