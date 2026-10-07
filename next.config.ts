import type { NextConfig } from "next";

/**
 * woork is deployed as a STATIC SITE.
 *
 * Every route is a client component and all state - including the training
 * game's progress - lives in localStorage. There is no server-side data
 * fetching, no route handler and no server action, so there is nothing that
 * needs a server at runtime.
 *
 * Why static export rather than a server runtime on Cloudflare Workers:
 * rendering the app through the OpenNext server bundle on the Workers runtime
 * failed at request time, making every HTML route return 500 while static
 * chunks still served correctly. Serving the exported HTML removes the server
 * function entirely, which removes that class of failure and is a better fit
 * for an app that is genuinely client-only.
 *
 * `distDir` is kept separate from `.next` so the export output is never confused
 * with the dev/build cache.
 */
const nextConfig: NextConfig = {
    output: "export",
    distDir: ".next-static",
    images: {
        // Required for static export: there is no image optimisation server.
        unoptimized: true,
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
