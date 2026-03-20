import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";

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
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
