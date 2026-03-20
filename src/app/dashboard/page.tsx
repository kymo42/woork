"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

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
                            <span className="text-sm text-gray-600">{user.email}</span>
                            <button
                                onClick={() => {
                                    // Sign out logic here
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
                        <div className="text-center py-8">
                            <p className="text-gray-500">No messages yet</p>
                        </div>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="mt-8 bg-gradient-to-r from-woork-teal/10 to-woork-coral/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-woork-navy mb-4">Getting Started</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">1</div>
                            <h4 className="font-medium text-woork-navy">Complete Profile</h4>
                            <p className="text-sm text-gray-500 mt-1">Add your skills and experience</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">2</div>
                            <h4 className="font-medium text-woork-navy">Find Jobs</h4>
                            <p className="text-sm text-gray-500 mt-1">Browse jobs that match you</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">3</div>
                            <h4 className="font-medium text-woork-navy">Apply</h4>
                            <p className="text-sm text-gray-500 mt-1">Send applications to employers</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold mb-2">4</div>
                            <h4 className="font-medium text-woork-navy">Get Hired</h4>
                            <p className="text-sm text-gray-500 mt-1">Land your first job!</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
