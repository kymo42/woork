"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const INDUSTRIES = [
    "Retail & Customer Service",
    "Hospitality & Food",
    "Agriculture & Environment",
    "Sports & Recreation",
    "Arts & Creative",
    "Technology & IT",
    "Health & Beauty",
    "Automotive",
    "Construction & Trade",
    "Education & Tutoring",
    "Administration & Office",
    "Delivery & Logistics",
    "Other"
];

const JOB_TYPES = [
    { value: "casual", label: "Casual", description: "Flexible hours, no guaranteed shifts" },
    { value: "part-time", label: "Part-Time", description: "Regular scheduled hours, up to 35hrs/week" },
    { value: "internship", label: "Internship", description: "Work experience, may be unpaid or paid" },
    { value: "apprenticeship", label: "Apprenticeship", description: "Formal training with employment" }
];

const AUSTRALIAN_STATES = [
    { value: "NSW", label: "NSW" },
    { value: "VIC", label: "VIC" },
    { value: "QLD", label: "QLD" },
    { value: "WA", label: "WA" },
    { value: "SA", label: "SA" },
    { value: "TAS", label: "TAS" },
    { value: "ACT", label: "ACT" },
    { value: "NT", label: "NT" }
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const COMMON_SKILLS = [
    "Customer Service", "Communication", "Teamwork", "Reliability", "Punctuality",
    "Cash Handling", "Food Handling", "Computer Skills", "Problem Solving",
    "Time Management", "Basic Math", "Phone Etiquette", "Social Media"
];

export default function PostJobPage() {
    const { user, loading: authLoading, userType } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "casual" as "casual" | "part-time" | "internship" | "apprenticeship",
        industry: "",
        minAge: 14,
        maxAge: 17,
        requiredSkills: [] as string[],
        preferredSkills: [] as string[],
        suburb: "",
        state: "NSW",
        postcode: "",
        hoursPerWeek: "",
        flexible: true,
        shifts: [] as { day: string; startTime: string; endTime: string }[],
        payType: "hourly" as "hourly" | "weekly" | "monthly",
        payAmount: "",
        award: "",
        status: "draft" as "draft" | "active"
    });

    const [customSkill, setCustomSkill] = useState("");

    useEffect(() => {
        if (!authLoading && (!user || userType !== "employer")) {
            router.push("/login");
        }
    }, [user, userType, authLoading, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSkill = (skill: string, field: "requiredSkills" | "preferredSkills") => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(skill)
                ? prev[field].filter(s => s !== skill)
                : [...prev[field], skill]
        }));
    };

    const addCustomSkill = (field: "requiredSkills" | "preferredSkills") => {
        if (customSkill.trim() && !formData[field].includes(customSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], customSkill.trim()]
            }));
            setCustomSkill("");
        }
    };

    const addShift = () => {
        setFormData(prev => ({
            ...prev,
            shifts: [...prev.shifts, { day: "Monday", startTime: "09:00", endTime: "17:00" }]
        }));
    };

    const updateShift = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            shifts: prev.shifts.map((shift, i) =>
                i === index ? { ...shift, [field]: value } : shift
            )
        }));
    };

    const removeShift = (index: number) => {
        setFormData(prev => ({
            ...prev,
            shifts: prev.shifts.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!user) throw new Error("You must be logged in");
            if (!db) throw new Error("Database not initialized");

            const jobData = {
                employerId: user.uid,
                title: formData.title,
                description: formData.description,
                type: formData.type,
                industry: formData.industry,
                minAge: formData.minAge,
                maxAge: formData.maxAge,
                requiredSkills: formData.requiredSkills,
                preferredSkills: formData.preferredSkills,
                location: {
                    suburb: formData.suburb,
                    state: formData.state,
                    postcode: formData.postcode
                },
                schedule: {
                    hoursPerWeek: formData.hoursPerWeek,
                    shifts: formData.shifts,
                    flexible: formData.flexible
                },
                pay: {
                    type: formData.payType,
                    amount: parseFloat(formData.payAmount) || 0,
                    award: formData.award
                },
                status: formData.status,
                postedAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                views: 0,
                applications: 0,
                isVerified: false,
                moderationStatus: "pending"
            };

            await addDoc(collection(db, "jobs"), jobData);
            setSuccess(true);

            setTimeout(() => {
                router.push("/employer/dashboard");
            }, 2000);

        } catch (err: any) {
            setError(err.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="text-center">
                    <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Job Posted!</h2>
                    <p className="text-slate-400">Your job is now pending review and will be live soon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-teal-400 hover:text-teal-300 flex items-center gap-2 mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
                    <p className="text-slate-400 mt-2">Find your next great teen employee</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">1</span>
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Job Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Retail Assistant, Café Crew Member"
                                    required
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                                    required
                                    rows={5}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Type *</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {JOB_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Industry *</label>
                                    <select
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">Select industry</option>
                                        {INDUSTRIES.map(ind => (
                                            <option key={ind} value={ind}>{ind}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Age & Location */}
                    <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">2</span>
                            Age & Location
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Age Requirements</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Minimum Age</label>
                                        <input
                                            type="number"
                                            name="minAge"
                                            value={formData.minAge}
                                            onChange={handleInputChange}
                                            min={14}
                                            max={17}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Maximum Age</label>
                                        <input
                                            type="number"
                                            name="maxAge"
                                            value={formData.maxAge}
                                            onChange={handleInputChange}
                                            min={14}
                                            max={17}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Suburb</label>
                                    <input
                                        type="text"
                                        name="suburb"
                                        value={formData.suburb}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Sydney CBD"
                                        required
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {AUSTRALIAN_STATES.map(state => (
                                            <option key={state.value} value={state.value}>{state.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Postcode</label>
                                <input
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2000"
                                    required
                                    maxLength={4}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">3</span>
                            Skills Required
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Required Skills (must-haves)</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {COMMON_SKILLS.filter(s => !formData.preferredSkills.includes(s)).map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill, "requiredSkills")}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.requiredSkills.includes(skill)
                                                ? "bg-teal-500 text-white"
                                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customSkill}
                                        onChange={(e) => setCustomSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill("requiredSkills"))}
                                        placeholder="Add custom skill..."
                                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addCustomSkill("requiredSkills")}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.requiredSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.requiredSkills.map(skill => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSkill(skill, "requiredSkills")}
                                                    className="hover:text-white"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Preferred Skills (nice-to-haves)</label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_SKILLS.filter(s => !formData.requiredSkills.includes(s)).map(skill => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill, "preferredSkills")}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.preferredSkills.includes(skill)
                                                ? "bg-coral-500 text-white"
                                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                                {formData.preferredSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.preferredSkills.map(skill => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-coral-500/20 text-coral-400 rounded-full text-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSkill(skill, "preferredSkills")}
                                                    className="hover:text-white"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Schedule */}
                    <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">4</span>
                            Schedule & Pay
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Hours per Week</label>
                                    <input
                                        type="text"
                                        name="hoursPerWeek"
                                        value={formData.hoursPerWeek}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 10-15 hours"
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Flexible Hours?</label>
                                    <div className="flex items-center gap-4 mt-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="flexible"
                                                checked={formData.flexible}
                                                onChange={() => setFormData(prev => ({ ...prev, flexible: true }))}
                                                className="w-4 h-4 text-teal-500"
                                            />
                                            <span className="text-slate-300">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="flexible"
                                                checked={!formData.flexible}
                                                onChange={() => setFormData(prev => ({ ...prev, flexible: false }))}
                                                className="w-4 h-4 text-teal-500"
                                            />
                                            <span className="text-slate-300">No</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-slate-300">Specific Shifts</label>
                                    <button
                                        type="button"
                                        onClick={addShift}
                                        className="text-sm text-teal-400 hover:text-teal-300"
                                    >
                                        + Add Shift
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.shifts.map((shift, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <select
                                                value={shift.day}
                                                onChange={(e) => updateShift(index, "day", e.target.value)}
                                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                                            >
                                                {DAYS.map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="time"
                                                value={shift.startTime}
                                                onChange={(e) => updateShift(index, "startTime", e.target.value)}
                                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                                            />
                                            <span className="text-slate-400">to</span>
                                            <input
                                                type="time"
                                                value={shift.endTime}
                                                onChange={(e) => updateShift(index, "endTime", e.target.value)}
                                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeShift(index)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Pay Type</label>
                                    <select
                                        name="payType"
                                        value={formData.payType}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="hourly">Hourly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
                                    <input
                                        type="number"
                                        name="payAmount"
                                        value={formData.payAmount}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 25.00"
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Award Rate</label>
                                    <input
                                        type="text"
                                        name="award"
                                        value={formData.award}
                                        onChange={handleInputChange}
                                        placeholder="e.g., General Retail"
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Publish */}
                    <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">5</span>
                            Publish
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        checked={formData.status === "draft"}
                                        onChange={() => setFormData(prev => ({ ...prev, status: "draft" }))}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all ${formData.status === "draft"
                                        ? "border-teal-500 bg-teal-500/10"
                                        : "border-slate-600 hover:border-slate-500"
                                        }`}>
                                        <div className="font-medium text-white">Save as Draft</div>
                                        <div className="text-sm text-slate-400">Post when ready</div>
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={formData.status === "active"}
                                        onChange={() => setFormData(prev => ({ ...prev, status: "active" }))}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all ${formData.status === "active"
                                        ? "border-teal-500 bg-teal-500/10"
                                        : "border-slate-600 hover:border-slate-500"
                                        }`}>
                                        <div className="font-medium text-white">Post Immediately</div>
                                        <div className="text-sm text-slate-400">Goes live after review</div>
                                    </div>
                                </label>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="text-sm text-yellow-200">
                                        All job posts are reviewed by our team before going live to ensure safety and compliance with Australian workplace laws.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Posting...
                                    </span>
                                ) : formData.status === "draft" ? "Save Draft" : "Post Job"
                                }
                            </button>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
}
