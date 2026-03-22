"use client";

import { useCallback, useEffect, useState } from "react";

declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: TurnstileOptions) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

interface TurnstileOptions {
    sitekey: string;
    theme?: "light" | "dark" | "auto";
    callback?: (token: string) => void;
    "error-callback"?: () => void;
    "expired-callback"?: () => void;
    "before-interactive-callback"?: () => void;
    "after-interactive-callback"?: () => void;
    supportLang?: boolean;
}

interface TurnstileProps {
    onVerify: (token: string) => void;
    theme?: "light" | "dark";
}

export function Turnstile({ onVerify, theme = "light" }: TurnstileProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Load Turnstile script
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            // Check if script still exists before removing
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const renderWidget = useCallback(() => {
        if (typeof window === "undefined" || !window.turnstile) return;

        const container = document.getElementById("turnstile-container");
        if (!container) return;

        // Check if already rendered
        if (container.children.length > 0) return;

        window.turnstile.render(container, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
            theme,
            callback: onVerify,
        });
    }, [onVerify, theme]);

    useEffect(() => {
        if (mounted) {
            // Wait for script to load
            const checkTurnstile = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(checkTurnstile);
                    renderWidget();
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => clearInterval(checkTurnstile), 5000);
        }
    }, [mounted, renderWidget]);

    return (
        <div
            id="turnstile-container"
            className="turnstile-container"
            style={{ minHeight: "65px" }}
        />
    );
}
