"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { X, User, Phone, Mail, MapPin } from "lucide-react";

interface LinkedTeen {
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
    skills: string[];
    appliedJobs: string[];
    status: "active" | "hired";
}

interface Application {
    id: string;
    jobId: string;
    teenId: string;
    teenName: string;
    jobTitle: string;
    employerName: string;
    company: string;
    coverMessage: string;
    status: string;
    createdAt: string;
}

export default function ParentDashboard() {
    const { user, loading: authLoading, userType, signOut } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "applications" | "teens" | "settings">("overview");
    const [linkedTeens, setLinkedTeens] = useState<LinkedTeen[]>([]);
    const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
    const [parentData, setParentData] = useState<any>(null);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: ""
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        } else if (user && userType && userType !== "parent") {
            router.push("/dashboard");
        } else if (user && userType === "parent") {
            fetchData();
        }
    }, [user, userType, authLoading, router]);

    const fetchData = async () => {
        if (!user || !db) {
            setLoading(false);
            return;
        }

        try {
            // Fetch parent profile
            const parentDoc = await getDoc(doc(db, "users", user.uid));
            if (parentDoc.exists()) {
                const data = parentDoc.data();
                setParentData(data);

                // Fetch linked teens
                if (data.teenIds && data.teenIds.length > 0) {
                    const teens: LinkedTeen[] = [];
                    for (const teenId of data.teenIds) {
                        const teenDoc = await getDoc(doc(db, "users", teenId));
                        if (teenDoc.exists()) {
                            teens.push({
                                id: teenId,
                                firstName: teenDoc.data().firstName || "",
                                lastName: teenDoc.data().lastName || "",
                                bio: teenDoc.data().bio || "",
                                skills: teenDoc.data().skills || [],
                                appliedJobs: teenDoc.data().appliedJobs || [],
                                status: teenDoc.data().status || "active"
                            });
                        }
                    }
                    setLinkedTeens(teens);

                    // Fetch pending applications for all teens
                    const apps: Application[] = [];
                    for (const teen of teens) {
                        const appsQuery = query(
                            collection(db, "applications"),
                            where("teenId", "==", teen.id),
                            where("status", "==", "pending_parent")
                        );
                        const appsSnapshot = await getDocs(appsQuery);
                        appsSnapshot.forEach(appDoc => {
                            const appData = appDoc.data();
                            apps.push({
                                id: appDoc.id,
                                jobId: appData.jobId,
                                teenId: appData.teenId,
                                teenName: `${teen.firstName} ${teen.lastName}`,
                                jobTitle: appData.jobTitle || "Job",
                                employerName: appData.employerName || "Employer",
                                company: appData.company || "",
                                coverMessage: appData.coverMessage || "",
                                status: appData.status,
                                createdAt: appData.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"
                            });
                        });
                    }
                    setPendingApplications(apps);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplication = async (appId: string, approved: boolean) => {
        if (!db) return;

        try {
            await updateDoc(doc(db, "applications", appId), {
                status: approved ? "submitted" : "rejected",
                parentApproval: {
                    status: approved ? "approved" : "rejected",
                    approvedAt: new Date(),
                    notes: approved ? "Approved by parent" : "Rejected by parent"
                }
            });

            // Refresh data
            fetchData();
        } catch (error) {
            console.error("Error updating application:", error);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-woork-teal">woork</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400">Welcome, {parentData?.firstName || "Parent"}</span>
                            <Link href="/parent/dashboard" className="flex items-center gap-2 hover:bg-slate-700 rounded-lg px-2 py-1 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-woork-coral text-white flex items-center justify-center font-medium">
                                    {parentData?.firstName?.[0] || "P"}
                                </div>
                                <span className="text-sm text-slate-300 hidden sm:inline">Dashboard</span>
                            </Link>
                            <button
                                onClick={async () => {
                                    await signOut();
                                    router.push("/");
                                }}
                                className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {[
                        { id: "overview", label: "Overview", icon: "📊" },
                        { id: "applications", label: "Applications", icon: "📝", badge: pendingApplications.length },
                        { id: "teens", label: "My Teens", icon: "👨‍👩‍👧‍👦" },
                        { id: "settings", label: "Settings", icon: "⚙️" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-woork-teal text-white"
                                : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700"
                                }`}
                        >
                            {tab.icon} {tab.label}
                            {tab.badge ? (
                                <span className="bg-woork-coral text-white text-xs px-2 py-0.5 rounded-full">
                                    {tab.badge}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <div className="text-3xl font-bold text-woork-teal">{linkedTeens.length}</div>
                                <div className="text-slate-400">Linked Teens</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <div className="text-3xl font-bold text-woork-coral">{pendingApplications.length}</div>
                                <div className="text-slate-400">Pending Approvals</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <div className="text-3xl font-bold text-yellow-400">
                                    {linkedTeens.filter(t => t.status === "hired").length}
                                </div>
                                <div className="text-slate-400">Hired</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <div className="text-3xl font-bold text-green-400">
                                    {linkedTeens.reduce((acc, t) => acc + (t.appliedJobs?.length || 0), 0)}
                                </div>
                                <div className="text-slate-400">Total Applications</div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        {pendingApplications.length > 0 && (
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-woork-coral rounded-full animate-pulse"></span>
                                    Pending Approvals
                                </h2>
                                <div className="space-y-4">
                                    {pendingApplications.slice(0, 3).map(app => (
                                        <div key={app.id} className="bg-slate-700/30 rounded-xl p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium text-white">{app.jobTitle}</h3>
                                                    <p className="text-sm text-slate-400">{app.employerName} • {app.company}</p>
                                                    <p className="text-sm text-slate-500 mt-1">Applied by: {app.teenName}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApplication(app.id, false)}
                                                        className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApplication(app.id, true)}
                                                        className="px-3 py-1.5 text-sm bg-woork-teal text-white rounded-lg hover:bg-woork-teal/80"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingApplications.length > 3 && (
                                        <button
                                            onClick={() => setActiveTab("applications")}
                                            className="text-woork-teal text-sm hover:underline"
                                        >
                                            View all {pendingApplications.length} applications →
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-woork-teal/20 to-woork-navy/20 rounded-2xl p-6 border border-woork-teal/30">
                                <h3 className="font-semibold text-white mb-2">Link a New Teen</h3>
                                <p className="text-slate-400 text-sm mb-4">Connect your teen's account to manage their applications.</p>
                                <Link
                                    href="/parent/link-teen"
                                    className="inline-flex items-center gap-2 text-woork-teal hover:underline"
                                >
                                    Link Teen Account →
                                </Link>
                            </div>
                            <div className="bg-gradient-to-br from-woork-coral/20 to-woork-navy/20 rounded-2xl p-6 border border-woork-coral/30">
                                <h3 className="font-semibold text-white mb-2">Notification Settings</h3>
                                <p className="text-slate-400 text-sm mb-4">Control how you receive updates about your teens.</p>
                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className="inline-flex items-center gap-2 text-woork-coral hover:underline"
                                >
                                    Manage Settings →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === "applications" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Application Approvals</h2>

                        {pendingApplications.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-lg font-medium text-white mb-2">All Caught Up!</h3>
                                <p className="text-slate-400">No applications pending your approval.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingApplications.map(app => (
                                    <div key={app.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-white text-lg">{app.jobTitle}</h3>
                                                <p className="text-slate-400">{app.employerName} • {app.company}</p>
                                                <p className="text-sm text-slate-500">Applied by {app.teenName} • {app.createdAt}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                                                Pending Approval
                                            </span>
                                        </div>

                                        {app.coverMessage && (
                                            <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
                                                <p className="text-sm text-slate-300">{app.coverMessage}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApplication(app.id, false)}
                                                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                            >
                                                Reject Application
                                            </button>
                                            <button
                                                onClick={() => handleApplication(app.id, true)}
                                                className="px-4 py-2 bg-woork-teal text-white rounded-xl hover:bg-woork-teal/80 transition-colors"
                                            >
                                                Approve & Submit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Teens Tab */}
                {activeTab === "teens" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Linked Teens</h2>
                            <Link
                                href="/parent/link-teen"
                                className="px-4 py-2 bg-woork-teal text-white rounded-xl hover:bg-woork-teal/80 transition-colors"
                            >
                                + Link Teen
                            </Link>
                        </div>

                        {linkedTeens.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                                <h3 className="text-lg font-medium text-white mb-2">No Teens Linked</h3>
                                <p className="text-slate-400 mb-4">Link your teen's account to help them manage their job applications.</p>
                                <Link
                                    href="/parent/link-teen"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-woork-teal text-white rounded-xl hover:bg-woork-teal/80"
                                >
                                    + Link First Teen
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {linkedTeens.map(teen => (
                                    <div key={teen.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center text-2xl font-bold">
                                                {teen.firstName[0]}{teen.lastName[0]}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white text-lg">
                                                    {teen.firstName} {teen.lastName}
                                                </h3>
                                                <p className="text-slate-400 text-sm mb-2">
                                                    {teen.appliedJobs?.length || 0} applications
                                                </p>
                                                {teen.status === "hired" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                                        ✓ Hired
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {teen.skills && teen.skills.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {teen.skills.slice(0, 5).map((skill: string) => (
                                                    <span key={skill} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>

                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <h3 className="font-medium text-white mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                {[
                                    { id: "email", label: "Email Notifications", desc: "Receive updates via email" },
                                    { id: "applications", label: "Application Updates", desc: "When teens apply or get responses" },
                                    { id: "messages", label: "Messages", desc: "When employers contact your teen" }
                                ].map(item => (
                                    <label key={item.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50">
                                        <div>
                                            <div className="font-medium text-white">{item.label}</div>
                                            <div className="text-sm text-slate-400">{item.desc}</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-5 h-5 text-woork-teal rounded focus:ring-woork-teal"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <h3 className="font-medium text-white mb-4">Account Settings</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setProfileFormData({
                                            firstName: parentData?.firstName || "",
                                            lastName: parentData?.lastName || "",
                                            phone: parentData?.phone || "",
                                            email: parentData?.email || user?.email || "",
                                            address: parentData?.address || ""
                                        });
                                        setShowProfileEdit(true);
                                    }}
                                    className="w-full text-left p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="font-medium text-white">Update Profile</div>
                                    <div className="text-sm text-slate-400">Change your name and contact details</div>
                                </button>
                                <button className="w-full text-left p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                                    <div className="font-medium text-white">Change Password</div>
                                    <div className="text-sm text-slate-400">Update your account password</div>
                                </button>
                                <button className="w-full text-left p-4 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors">
                                    <div className="font-medium text-red-400">Delete Account</div>
                                    <div className="text-sm text-slate-400">Remove your account and linked teens</div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Edit Modal */}
                {showProfileEdit && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700">
                            <div className="p-6 border-b border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-white">Update Profile</h2>
                                    <button
                                        onClick={() => setShowProfileEdit(false)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (!db || !user) return;
                                setSavingProfile(true);
                                try {
                                    await updateDoc(doc(db, "users", user.uid), {
                                        firstName: profileFormData.firstName,
                                        lastName: profileFormData.lastName,
                                        phone: profileFormData.phone,
                                        address: profileFormData.address,
                                        updatedAt: new Date().toISOString()
                                    });
                                    setParentData({
                                        ...parentData,
                                        firstName: profileFormData.firstName,
                                        lastName: profileFormData.lastName,
                                        phone: profileFormData.phone,
                                        address: profileFormData.address
                                    });
                                    setShowProfileEdit(false);
                                } catch (error) {
                                    console.error("Error updating profile:", error);
                                    alert("Failed to update profile. Please try again.");
                                } finally {
                                    setSavingProfile(false);
                                }
                            }} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                value={profileFormData.firstName}
                                                onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                value={profileFormData.lastName}
                                                onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="tel"
                                            value={profileFormData.phone}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                            placeholder="Contact number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            value={profileFormData.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            value={profileFormData.address}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                            placeholder="Your address"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowProfileEdit(false)}
                                        className="flex-1 px-4 py-2 border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="flex-1 px-4 py-2 bg-woork-teal text-white rounded-lg hover:bg-woork-teal/90 transition-colors disabled:opacity-50"
                                    >
                                        {savingProfile ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
