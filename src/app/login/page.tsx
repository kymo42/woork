"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Chrome,
    Github
} from "lucide-react";
import { useAuth } from "@/components/providers";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your email and password");
            return;
        }

        setLoading(true);

        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to log in with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithGithub();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to log in with GitHub");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-woork-cream via-white to-woork-teal/5">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </Link>
                        <Link href="/signup" className="text-gray-600 hover:text-woork-navy font-medium">
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-woork-navy mb-2">Welcome back</h1>
                    <p className="text-gray-600">Log in to continue to woork</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Social Login */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <Chrome className="w-5 h-5" />
                            <span className="font-medium text-gray-700">Continue with Google</span>
                        </button>

                        <button
                            onClick={handleGithubLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <Github className="w-5 h-5" />
                            <span className="font-medium text-gray-700">Continue with GitHub</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or continue with email</span>
                        </div>
                    </div>

                    {/* Email Login */}
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-10 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <Link href="/forgot-password" className="text-sm text-woork-teal hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Log in
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 mt-6">
                    By logging in, you agree to our{" "}
                    <a href="#" className="text-woork-teal hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-woork-teal hover:underline">Privacy Policy</a>
                </p>
            </main>
        </div>
    );
}
