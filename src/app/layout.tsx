import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { DarkModeProvider } from "@/components/DarkModeToggle";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    title: "woork - Find Your First Job",
    description: "The modern job platform for Australian teenagers. Find casual jobs, build your resume, and connect with local employers.",
    keywords: ["teen jobs", "part time jobs", "casual work", "young workers", "Australia jobs"],
    // The favicon is supplied by src/app/icon.svg, which the App Router wires up
    // automatically. There is no public/favicon.ico, so do not reference one.
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans antialiased`}>
                <DarkModeProvider>
                    <Providers>
                        {children}
                    </Providers>
                </DarkModeProvider>
            </body>
        </html>
    );
}
