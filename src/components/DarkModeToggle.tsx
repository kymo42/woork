"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DarkModeContextType = {
    isDark: boolean;
    toggle: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({
    isDark: false,
    toggle: () => { },
});

export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check localStorage or system preference
        const stored = localStorage.getItem("darkMode");
        if (stored !== null) {
            setIsDark(stored === "true");
        } else {
            setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", String(isDark));
    }, [isDark]);

    const toggle = () => setIsDark(!isDark);

    return (
        <DarkModeContext.Provider value={{ isDark, toggle }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    return useContext(DarkModeContext);
}
