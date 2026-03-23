"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Briefcase,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type UserType = "teen" | "parent" | "employer";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    // Teen specific
    schoolName: string;
    schoolYear: string;
    // Parent specific
    children: string[];
    // Employer specific
    companyName: string;
    companyPosition: string;
    abn: string;
}

function ProfileSetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [userType, setUserType] = useState<UserType>("teen");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        schoolName: "",
        schoolYear: "",
        children: [],
        companyName: "",
        companyPosition: "",
        abn: ""
    });

    useEffect(() => {
        const type = searchParams.get("type") as UserType;
        if (type && ["teen", "parent", "employer"].includes(type)) {
            setUserType(type);
        }
    }, [searchParams]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || "",
                firstName: user.displayName?.split(" ")[0] || "",
                lastName: user.displayName?.split(" ").slice(1).join(" ") || ""
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!user) {
            setError("You must be logged in to complete your profile");
            return;
        }

        // Validation
        if (!formData.firstName || !formData.lastName) {
            setError("Please enter your full name");
            return;
        }

        // Calculate age for teens
        let age = 0;
        if (userType === "teen" && formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 13 || age > 17) {
                setError("You must be between 13 and 17 years old to use woork");
                return;
            }
        }

        if (userType === "employer") {
            if (!formData.companyName || !formData.abn) {
                setError("Please enter your company name and ABN");
                return;
            }
        }

        if (!db) {
            setError("Database connection not ready. Please refresh and try again.");
            return;
        }

        setSaving(true);

        try {
            // Create user profile document
            const profileData: any = {
                userId: user.uid,
                userType,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                profileComplete: true
            };

            if (userType === "teen") {
                profileData.dateOfBirth = formData.dateOfBirth;
                profileData.schoolName = formData.schoolName || "";
                profileData.schoolYear = formData.schoolYear || "";
                profileData.age = age;
                profileData.parentApproved = age >= 16;
                profileData.skills = [];
                profileData.badges = [];
            } else if (userType === "parent") {
                profileData.children = formData.children;
            } else if (userType === "employer") {
                profileData.companyName = formData.companyName;
                profileData.companyPosition = formData.companyPosition || "";
                profileData.abn = formData.abn;
                profileData.verified = false;
            }

            await setDoc(doc(db, "users", user.uid), profileData);

            setSuccess(true);

            // Redirect based on user type
            setTimeout(() => {
                if (userType === "teen") {
                    router.push("/dashboard");
                } else if (userType === "parent") {
                    router.push("/dashboard");
                } else if (userType === "employer") {
                    router.push("/employer/dashboard");
                }
            }, 1500);

        } catch (err: any) {
            console.error("Error saving profile:", err);
            setError(err.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-woork-teal" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-woork-cream via-white to-woork-teal/5 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-woork-navy mb-2">Profile Created!</h2>
                    <p className="text-gray-600 mb-4">Redirecting you to your dashboard...</p>
                </div>
            </div>
        );
    }

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
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-woork-navy mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="text-gray-600">
                        Tell us a bit about yourself to get started
                    </p>
                </div>

                {/* User Type Badge */}
                <div className="flex justify-center mb-8">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${userType === "teen" ? "bg-woork-teal/10 text-woork-teal" :
                        userType === "parent" ? "bg-purple-100 text-purple-600" :
                            "bg-blue-100 text-blue-600"
                        }`}>
                        {userType === "teen" && "👦 Teen Profile"}
                        {userType === "parent" && "👨‍👩‍👧 Parent Profile"}
                        {userType === "employer" && "🏢 Employer Profile"}
                    </span>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10 bg-gray-50"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number (optional)
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="0400 000 000"
                                />
                            </div>
                        </div>

                        {/* Teen-specific fields */}
                        {userType === "teen" && (
                            <>
                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                            required
                                            max={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        You must be between 13-17 years old
                                    </p>
                                </div>

                                {/* School */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        School Name (optional)
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="schoolName"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                            placeholder="Your high school"
                                        />
                                    </div>
                                </div>

                                {/* Year Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Year Level (optional)
                                    </label>
                                    <select
                                        name="schoolYear"
                                        value={formData.schoolYear}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="">Select year level</option>
                                        <option value="7">Year 7</option>
                                        <option value="8">Year 8</option>
                                        <option value="9">Year 9</option>
                                        <option value="10">Year 10</option>
                                        <option value="11">Year 11</option>
                                        <option value="12">Year 12</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Employer-specific fields */}
                        {userType === "employer" && (
                            <>
                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                            placeholder="Your company name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Position (optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="companyPosition"
                                        value={formData.companyPosition}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g., HR Manager"
                                    />
                                </div>

                                {/* ABN */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ABN (Australian Business Number)
                                    </label>
                                    <input
                                        type="text"
                                        name="abn"
                                        value={formData.abn}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="12 345 678 901"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Required for verification
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Complete Profile
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-woork-teal mx-auto" />
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export default function ProfileSetupPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ProfileSetupContent />
        </Suspense>
    );
}
