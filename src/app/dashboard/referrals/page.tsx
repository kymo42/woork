"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Briefcase,
    Users,
    Check,
    X,
    Star,
    MessageSquare,
    Shield,
    UserPlus,
    Award,
    ThumbsUp,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

interface Vouch {
    id: string;
    fromTeenId: string;
    fromTeenName: string;
    toTeenId: string;
    toTeenName: string;
    skill: string;
    message: string;
    status: "pending" | "accepted" | "declined";
    createdAt: string;
    respondedAt?: string;
}

export default function ReferralsPage() {
    const { user, loading: authLoading, userType } = useAuth();
    const router = useRouter();
    const [vouches, setVouches] = useState<Vouch[]>([]);
    const [sentRequests, setSentRequests] = useState<Vouch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [newRequest, setNewRequest] = useState({
        teenName: "",
        skill: "",
        message: ""
    });

    const commonSkills = [
        "Reliable and punctual",
        "Great customer service",
        "Strong teamwork",
        "Good communication",
        "Hard worker",
        "Quick learner",
        "Friendly personality",
        "Responsible"
    ];

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        } else if (!authLoading && user && userType && userType !== "teen") {
            router.push("/dashboard");
        }
    }, [user, authLoading, userType, router]);

    useEffect(() => {
        if (user && userType === "teen") {
            fetchVouches();
        }
    }, [user, userType]);

    const fetchVouches = async () => {
        if (!db || !user) return;

        try {
            // Fetch received vouches
            const receivedQuery = query(
                collection(db, "vouches"),
                where("toTeenId", "==", user.uid)
            );
            const receivedSnapshot = await getDocs(receivedQuery);
            const receivedData = receivedSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Vouch[];
            setVouches(receivedData.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));

            // Fetch sent requests
            const sentQuery = query(
                collection(db, "vouches"),
                where("fromTeenId", "==", user.uid)
            );
            const sentSnapshot = await getDocs(sentQuery);
            const sentData = sentSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Vouch[];
            setSentRequests(sentData.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (error) {
            console.error("Error fetching vouches:", error);
        } finally {
            setLoading(false);
        }
    };

    const requestVouch = async () => {
        if (!db || !user) return;
        if (!newRequest.teenName.trim() || !newRequest.skill) {
            alert("Please enter the friend's name and select a skill!");
            return;
        }

        setRequesting(true);
        try {
            const profileDoc = await getDoc(doc(db, "users", user.uid));
            const profileData = profileDoc.data();

            await addDoc(collection(db, "vouches"), {
                fromTeenId: user.uid,
                fromTeenName: `${profileData?.firstName || "Me"}`,
                toTeenId: "", // Empty until accepted
                toTeenName: newRequest.teenName,
                skill: newRequest.skill,
                message: newRequest.message,
                status: "pending",
                createdAt: serverTimestamp()
            });

            await fetchVouches();
            setShowRequestModal(false);
            setNewRequest({ teenName: "", skill: "", message: "" });
        } catch (error) {
            console.error("Error requesting vouch:", error);
            alert("Failed to send request. Please try again.");
        } finally {
            setRequesting(false);
        }
    };

    const respondToVouch = async (vouchId: string, accept: boolean) => {
        if (!db || !user) return;

        try {
            await updateDoc(doc(db, "vouches", vouchId), {
                status: accept ? "accepted" : "declined",
                toTeenId: user.uid,
                respondedAt: serverTimestamp()
            });

            await fetchVouches();
        } catch (error) {
            console.error("Error responding to vouch:", error);
            alert("Failed to respond. Please try again.");
        }
    };

    const pendingVouches = vouches.filter(v => v.status === "pending");
    const acceptedVouches = vouches.filter(v => v.status === "accepted");

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-woork-teal/30 border-t-woork-teal rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-woork-teal/5">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Teen Referrals</span>
                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="btn-primary text-sm flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Ask for Vouch
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero */}
                <div className="bg-gradient-to-r from-woork-coral to-woork-navy rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Teen Referrals 🤝</h1>
                            <p className="text-white/80 mb-4">
                                Get recommended by other teens! When friends vouch for you,
                                employers see that you're trusted by your peers.
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    <span>Mutual consent</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    <span>Builds trust</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{acceptedVouches.length}</div>
                            <div className="text-sm text-white/70">Vouches Earned</div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
                    <h2 className="text-lg font-semibold text-woork-navy mb-4">How it Works</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <h3 className="font-medium text-woork-navy mb-1">1. Ask a Friend</h3>
                            <p className="text-sm text-gray-500">Ask a teen you trust to vouch for you</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-3">
                                <ThumbsUp className="w-6 h-6" />
                            </div>
                            <h3 className="font-medium text-woork-navy mb-1">2. They Accept</h3>
                            <p className="text-sm text-gray-500">Your friend accepts and writes a vouch</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="font-medium text-woork-navy mb-1">3. Show Employers</h3>
                            <p className="text-sm text-gray-500">Employers see your trusted status!</p>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                {pendingVouches.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-woork-navy mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            Pending Requests ({pendingVouches.length})
                        </h2>
                        <div className="space-y-4">
                            {pendingVouches.map(vouch => (
                                <div key={vouch.id} className="bg-white rounded-xl p-5 border border-yellow-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold">
                                                {vouch.fromTeenName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-woork-navy">{vouch.fromTeenName}</div>
                                                <div className="text-sm text-gray-500">wants to vouch for you</div>
                                                <div className="mt-2">
                                                    <span className="skill-badge text-xs">{vouch.skill}</span>
                                                </div>
                                                {vouch.message && (
                                                    <p className="text-sm text-gray-600 mt-2 italic">"{vouch.message}"</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => respondToVouch(vouch.id, true)}
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Accept"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => respondToVouch(vouch.id, false)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="Decline"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Your Vouches */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-woork-navy mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-woork-teal" />
                        Your Vouches ({acceptedVouches.length})
                    </h2>
                    {acceptedVouches.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-woork-navy mb-2">No vouches yet</h3>
                            <p className="text-gray-500 mb-6">Ask friends to vouch for you to build trust with employers!</p>
                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="btn-primary"
                            >
                                Ask for a Vouch
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {acceptedVouches.map(vouch => (
                                <div key={vouch.id} className="bg-white rounded-xl p-5 border border-green-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-woork-teal/20 text-woork-teal flex items-center justify-center font-bold">
                                            {vouch.fromTeenName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-woork-navy">{vouch.fromTeenName}</span>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </div>
                                            <span className="skill-badge text-xs mt-1">{vouch.skill}</span>
                                            {vouch.message && (
                                                <p className="text-sm text-gray-600 mt-2">"{vouch.message}"</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sent Requests */}
                {sentRequests.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-woork-navy mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Your Sent Requests
                        </h2>
                        <div className="space-y-3">
                            {sentRequests.map(vouch => (
                                <div key={vouch.id} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-woork-navy">Requested from: {vouch.toTeenName}</span>
                                            <span className="skill-badge text-xs ml-2">{vouch.skill}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${vouch.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                vouch.status === "accepted" ? "bg-green-100 text-green-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}>
                                            {vouch.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-woork-navy">Ask for a Vouch</h2>
                                <button
                                    onClick={() => setShowRequestModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Friend's Name
                                </label>
                                <input
                                    type="text"
                                    value={newRequest.teenName}
                                    onChange={(e) => setNewRequest({ ...newRequest, teenName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                    placeholder="Who do you want to ask?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    What do you want them to vouch for?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {commonSkills.map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => setNewRequest({ ...newRequest, skill })}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${newRequest.skill === skill
                                                    ? "bg-woork-teal text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add a message (optional)
                                </label>
                                <textarea
                                    value={newRequest.message}
                                    onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                    placeholder="Ask them nicely!"
                                />
                            </div>

                            <div className="bg-woork-teal/10 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-woork-teal mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-woork-navy text-sm">How this works</h4>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Your friend will receive a notification and can choose to accept or decline.
                                            They don't have to vouch if they don't want to.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={requestVouch}
                                disabled={requesting || !newRequest.teenName.trim() || !newRequest.skill}
                                className="flex-1 px-4 py-2 bg-woork-teal text-white rounded-lg hover:bg-woork-teal/90 transition-colors disabled:opacity-50"
                            >
                                {requesting ? "Sending..." : "Send Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
