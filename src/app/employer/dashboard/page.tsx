"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    Building2,
    Users,
    Plus,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    Edit,
    Trash2,
    MapPin,
    DollarSign,
    TrendingUp,
    UserCheck,
    Mail
} from "lucide-react";
import { useAuth } from "@/components/providers";

type Tab = "jobs" | "candidates" | "applications" | "messages";

interface Job {
    id: string;
    title: string;
    type: string;
    location: string;
    applicants: number;
    views: number;
    status: "active" | "paused" | "closed";
    postedAt: string;
}

interface Candidate {
    id: string;
    name: string;
    age: number;
    location: string;
    skills: string[];
    status: "new" | "viewed" | "shortlisted" | "rejected";
}

const mockJobs: Job[] = [
    {
        id: "1",
        title: "Retail Assistant",
        type: "Casual",
        location: "Sydney NSW",
        applicants: 12,
        views: 156,
        status: "active",
        postedAt: "2025-03-15",
    },
    {
        id: "2",
        title: "Café Staff",
        type: "Part-time",
        location: "Melbourne VIC",
        applicants: 8,
        views: 89,
        status: "active",
        postedAt: "2025-03-18",
    },
];

const mockCandidates: Candidate[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        age: 16,
        location: "Sydney NSW",
        skills: ["Customer Service", "Cashier", "Retail"],
        status: "new",
    },
    {
        id: "2",
        name: "James Wilson",
        age: 17,
        location: "Sydney NSW",
        skills: ["Barista", "Hospitality", "Teamwork"],
        status: "shortlisted",
    },
    {
        id: "3",
        name: "Emily Chen",
        age: 15,
        location: "Melbourne VIC",
        skills: ["Retail", "Communication"],
        status: "viewed",
    },
];

export default function EmployerDashboard() {
    const { user, loading: authLoading, userType, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("jobs");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Redirect non-employers
    useEffect(() => {
        if (!authLoading && user && userType && userType !== "employer") {
            router.push("/dashboard");
        }
    }, [user, authLoading, userType, router]);

    const tabs = [
        { key: "jobs", label: "My Jobs", icon: <Briefcase className="w-4 h-4" /> },
        { key: "candidates", label: "Candidates", icon: <Users className="w-4 h-4" /> },
        { key: "applications", label: "Applications", icon: <UserCheck className="w-4 h-4" /> },
        { key: "messages", label: "Messages", icon: <Mail className="w-4 h-4" /> },
    ];

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-woork-teal/30 border-t-woork-teal rounded-full animate-spin" />
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
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/employer/post-job" className="btn-primary text-sm flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Post a Job
                            </Link>
                            <Link href="/employer/assessments" className="text-sm text-woork-teal hover:underline flex items-center gap-1">
                                🎮 Create Challenge
                            </Link>
                            <div className="flex items-center gap-2">
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
                                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-woork-navy">Employer Dashboard</h1>
                    <p className="text-gray-600">Manage your job posts and find great candidates</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-woork-teal/10 text-woork-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-woork-navy">{mockJobs.length}</p>
                                <p className="text-sm text-gray-500">Active Jobs</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-woork-navy">{mockCandidates.length}</p>
                                <p className="text-sm text-gray-500">New Candidates</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                <Eye className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-woork-navy">245</p>
                                <p className="text-sm text-gray-500">Profile Views</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-woork-navy">20</p>
                                <p className="text-sm text-gray-500">Applications</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex gap-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as Tab)}
                                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${activeTab === tab.key
                                    ? "border-woork-teal text-woork-teal"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search */}
                {activeTab !== "messages" && (
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search candidates or jobs..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                )}

                {/* Jobs Tab */}
                {activeTab === "jobs" && (
                    <div className="space-y-4">
                        {mockJobs.map(job => (
                            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-woork-navy">{job.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                {job.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Posted {job.postedAt}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-woork-navy">{job.applicants}</p>
                                            <p className="text-xs text-gray-500">Applicants</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-woork-navy">{job.views}</p>
                                            <p className="text-xs text-gray-500">Views</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-woork-teal hover:bg-woork-teal/10 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link
                            href="/employer/post-job"
                            className="block p-8 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-woork-teal hover:text-woork-teal transition-colors"
                        >
                            <Plus className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-medium">Post a new job</p>
                        </Link>
                    </div>
                )}

                {/* Candidates Tab */}
                {activeTab === "candidates" && (
                    <div className="space-y-4">
                        {mockCandidates.map(candidate => (
                            <div key={candidate.id} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-semibold">
                                            {candidate.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-woork-navy">{candidate.name}</h3>
                                            <p className="text-sm text-gray-500">{candidate.age} years old • {candidate.location}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {candidate.skills.map(skill => (
                                                    <span key={skill} className="skill-badge text-xs">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${candidate.status === "new" ? "bg-blue-100 text-blue-700" :
                                            candidate.status === "shortlisted" ? "bg-green-100 text-green-700" :
                                                candidate.status === "viewed" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-gray-100 text-gray-700"
                                            }`}>
                                            {candidate.status}
                                        </span>
                                        <button className="btn-primary text-sm">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === "applications" && (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-woork-navy mb-2">Applications will appear here</h3>
                        <p className="text-gray-500 mb-4">When candidates apply to your jobs, you'll see their applications here</p>
                        <Link href="/jobs" className="btn-secondary inline-flex">
                            View All Candidates
                        </Link>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === "messages" && (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-woork-navy mb-2">No messages yet</h3>
                        <p className="text-gray-500">Start a conversation with candidates to message them</p>
                    </div>
                )}
            </main>
        </div>
    );
}
