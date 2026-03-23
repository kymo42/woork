"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { Sparkles, Users } from "lucide-react";

export default function DashboardPage() {
    const { user, loading, signOut, userType } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Redirect to appropriate dashboard based on user type
    useEffect(() => {
        if (!loading && user && userType) {
            if (userType === "employer") {
                router.push("/employer/dashboard");
            } else if (userType === "parent") {
                router.push("/parent/dashboard");
            } else if (userType === "teen") {
                // Stay on this dashboard for teens
            }
        }
    }, [user, loading, userType, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-woork-teal/30 border-t-woork-teal rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <span className="text-white font-bold text-sm">W</span>
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/skills-market" className="text-sm text-woork-teal hover:underline flex items-center gap-1">
                                <Sparkles className="w-4 h-4" />
                                <span className="hidden md:inline">Skills Market</span>
                            </Link>
                            <Link href="/dashboard/referrals" className="text-sm text-woork-teal hover:underline flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span className="hidden md:inline">Referrals</span>
                            </Link>
                            <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-woork-navy text-white flex items-center justify-center text-sm font-medium">
                                    {user?.email?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span className="text-sm text-gray-700 hidden sm:inline">My Profile</span>
                            </Link>
                            <button
                                onClick={async () => {
                                    await signOut();
                                    router.push("/");
                                }}
                                className="text-sm text-gray-600 hover:text-woork-navy"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-woork-navy mb-8">Dashboard</h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-woork-navy mb-4">Your Profile</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Status</span>
                                <span className="text-woork-teal font-medium">Incomplete</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Skills Added</span>
                                <span className="font-medium">0</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Profile Views</span>
                                <span className="font-medium">0</span>
                            </div>
                        </div>
                        <Link
                            href="/profile"
                            className="btn-primary w-full mt-4 text-center block"
                        >
                            Complete Profile
                        </Link>
                    </div>

                    {/* Job Applications */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-woork-navy mb-4">Applications</h3>
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No applications yet</p>
                            <Link
                                href="/jobs"
                                className="btn-secondary w-full text-center block"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-woork-navy mb-4">Messages</h3>
                        <Link href="/messages" className="block text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <span className="text-woork-teal font-medium hover:underline">
                                View Messages →
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="mt-8 bg-gradient-to-r from-woork-teal/10 to-woork-coral/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-woork-navy mb-4">Getting Started</h2>
                    <div className="grid md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">1</div>
                            <h4 className="font-medium text-woork-navy">Complete Profile</h4>
                            <p className="text-sm text-gray-500 mt-1">Add your skills</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">2</div>
                            <h4 className="font-medium text-woork-navy">Skills Market</h4>
                            <p className="text-sm text-gray-500 mt-1">Advertise yourself</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">3</div>
                            <h4 className="font-medium text-woork-navy">Find Jobs</h4>
                            <p className="text-sm text-gray-500 mt-1">Browse matches</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">4</div>
                            <h4 className="font-medium text-woork-navy">Apply</h4>
                            <p className="text-sm text-gray-500 mt-1">Send apps</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">5</div>
                            <h4 className="font-medium text-woork-navy">Get Hired</h4>
                            <p className="text-sm text-gray-500 mt-1">Land your job!</p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <Link href="/dashboard/skills-market" className="btn-primary text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Go to Skills Market
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
