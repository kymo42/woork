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
    User,
    Building2,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { Turnstile } from "@/components/turnstile-provider";

type UserType = "teen" | "parent" | "employer";

export default function SignupPage() {
    const router = useRouter();
    const [userType, setUserType] = useState<UserType>("teen");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTurnstileVerify = (token: string) => {
        setTurnstileToken(token);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!email || !password || !firstName || !lastName) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!turnstileToken) {
            setError("Please complete the human verification");
            return;
        }

        setLoading(true);

        try {
            // Here we would:
            // 1. Verify the Turnstile token with Cloudflare
            // 2. Create the Firebase user
            // 3. Create the user profile in Firestore

            // For now, just simulate a successful signup
            console.log("Signup attempt:", { email, userType, firstName, lastName, turnstileToken });

            // Redirect to profile setup
            router.push(`/signup/profile?type=${userType}`);
        } catch (err: any) {
            setError(err.message || "Failed to create account");
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
                        <Link href="/login" className="text-gray-600 hover:text-woork-navy font-medium">
                            Already have an account? Log in
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-woork-navy mb-2">Create your account</h1>
                    <p className="text-gray-600">Join woork and start your career journey</p>
                </div>

                {/* User Type Selector */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => setUserType("teen")}
                        className={`p-4 rounded-xl border-2 transition-all ${userType === "teen"
                                ? "border-woork-teal bg-woork-teal/10"
                                : "border-gray-200 bg-white hover:border-woork-teal/50"
                            }`}
                    >
                        <User className={`w-8 h-8 mx-auto mb-2 ${userType === "teen" ? "text-woork-teal" : "text-gray-400"}`} />
                        <div className={`font-medium ${userType === "teen" ? "text-woork-teal" : "text-gray-600"}`}>Teen</div>
                        <div className="text-xs text-gray-500 mt-1">Looking for work</div>
                    </button>

                    <button
                        onClick={() => setUserType("parent")}
                        className={`p-4 rounded-xl border-2 transition-all ${userType === "parent"
                                ? "border-woork-teal bg-woork-teal/10"
                                : "border-gray-200 bg-white hover:border-woork-teal/50"
                            }`}
                    >
                        <User className={`w-8 h-8 mx-auto mb-2 ${userType === "parent" ? "text-woork-teal" : "text-gray-400"}`} />
                        <div className={`font-medium ${userType === "parent" ? "text-woork-teal" : "text-gray-600"}`}>Parent</div>
                        <div className="text-xs text-gray-500 mt-1">Guardians</div>
                    </button>

                    <button
                        onClick={() => setUserType("employer")}
                        className={`p-4 rounded-xl border-2 transition-all ${userType === "employer"
                                ? "border-woork-teal bg-woork-teal/10"
                                : "border-gray-200 bg-white hover:border-woork-teal/50"
                            }`}
                    >
                        <Building2 className={`w-8 h-8 mx-auto mb-2 ${userType === "employer" ? "text-woork-teal" : "text-gray-400"}`} />
                        <div className={`font-medium ${userType === "employer" ? "text-woork-teal" : "text-gray-600"}`}>Employer</div>
                        <div className="text-xs text-gray-500 mt-1">Hiring</div>
                    </button>
                </div>

                {/* Signup Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="input-field"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

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
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Turnstile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Human Verification</label>
                            <Turnstile
                                onVerify={handleTurnstileVerify}
                                theme="light"
                            />
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
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-center text-gray-500">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="text-woork-teal hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="text-woork-teal hover:underline">Privacy Policy</a>
                        </p>
                    </form>
                </div>

                {/* Benefits */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-5 h-5 text-woork-teal mb-1" />
                        <span className="text-sm text-gray-600">100% Free for Teens</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-5 h-5 text-woork-teal mb-1" />
                        <span className="text-sm text-gray-600">Parent Safety</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-5 h-5 text-woork-teal mb-1" />
                        <span className="text-sm text-gray-600">Verified Employers</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
