"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Briefcase,
    Plus,
    Search,
    MapPin,
    Star,
    Users,
    Check,
    X,
    ChevronRight,
    Building2,
    Calendar,
    MessageSquare,
    Shield,
    Sparkles,
    ThumbsUp
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";

interface SkillAd {
    id: string;
    teenId: string;
    teenName: string;
    teenArea: string;
    skills: string[];
    bio: string;
    type: "looking" | "available";
    experience: string;
    availability: string;
    createdAt: string;
    applications: number;
}

export default function SkillsMarketPage() {
    const { user, loading: authLoading, userType } = useAuth();
    const router = useRouter();
    const [skillAds, setSkillAds] = useState<SkillAd[]>([]);
    const [myAds, setMyAds] = useState<SkillAd[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newAd, setNewAd] = useState({
        skills: [] as string[],
        bio: "",
        type: "available" as "looking" | "available",
        experience: "",
        availability: ""
    });

    const metroAreas = [
        { value: "sydney-metro", label: "Sydney Metro" },
        { value: "melbourne-metro", label: "Melbourne Metro" },
        { value: "brisbane-metro", label: "Brisbane Metro" },
        { value: "perth-metro", label: "Perth Metro" },
        { value: "adelaide-metro", label: "Adelaide Metro" },
        { value: "gold-coast", label: "Gold Coast" },
        { value: "newcastle", label: "Newcastle" },
        { value: "canberra-metro", label: "Canberra Metro" },
        { value: "regional", label: "Regional Areas" },
    ];

    const commonSkills = [
        "Customer Service", "Retail", "Hospitality", "Barista", "Waitstaff",
        "Kitchen Hand", "Cashier", "Food Handling", "Teamwork", "Communication",
        "Computer Skills", "Social Media", "Delivery", "Driving", "Sports Coaching",
        "Tutoring", "Pet Sitting", "Gardening", "Cleaning", "Administration"
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
            fetchSkillAds();
        }
    }, [user, userType]);

    const fetchSkillAds = async () => {
        if (!db || !user) return;

        try {
            // Fetch user's own ads
            const myAdsQuery = query(
                collection(db, "skillAds"),
                where("teenId", "==", user.uid)
            );
            const myAdsSnapshot = await getDocs(myAdsQuery);
            const myAdsData = myAdsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SkillAd[];
            setMyAds(myAdsData);

            // Fetch all ads (in real app, add geo queries)
            const allAdsQuery = collection(db, "skillAds");
            const allAdsSnapshot = await getDocs(allAdsQuery);
            const allAdsData = allAdsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SkillAd[];

            // Filter out own ads and sort by date
            const otherAds = allAdsData
                .filter(ad => ad.teenId !== user.uid)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setSkillAds(otherAds);
        } catch (error) {
            console.error("Error fetching skill ads:", error);
            // Use mock data for demo
            setSkillAds([]);
        } finally {
            setLoading(false);
        }
    };

    const createSkillAd = async () => {
        if (!db || !user) return;
        if (newAd.skills.length === 0) {
            alert("Please select at least one skill!");
            return;
        }

        setCreating(true);
        try {
            // Get teen's profile info
            const profileDoc = await getDoc(doc(db, "users", user.uid));
            const profileData = profileDoc.data();

            const adData = {
                teenId: user.uid,
                teenName: `${profileData?.firstName || "Teen"} ${profileData?.lastName?.charAt(0) || ""}.`,
                teenArea: profileData?.suburb || "Unknown",
                skills: newAd.skills,
                bio: newAd.bio,
                type: newAd.type,
                experience: newAd.experience,
                availability: newAd.availability,
                createdAt: new Date().toISOString(),
                applications: 0
            };

            await addDoc(collection(db, "skillAds"), {
                ...adData,
                createdAt: serverTimestamp()
            });

            // Refresh ads
            await fetchSkillAds();
            setShowCreateModal(false);
            setNewAd({
                skills: [],
                bio: "",
                type: "available",
                experience: "",
                availability: ""
            });
        } catch (error) {
            console.error("Error creating skill ad:", error);
            alert("Failed to create ad. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    const filteredAds = skillAds.filter(ad => {
        const matchesSearch = searchQuery === "" ||
            ad.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ad.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ad.teenName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesArea = selectedArea === "" || ad.teenArea.includes(selectedArea);

        return matchesSearch && matchesArea;
    });

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
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Skills Market</span>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary text-sm flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Post My Skills
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero */}
                <div className="bg-gradient-to-r from-woork-teal to-woork-navy rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Skills Market 🎯</h1>
                            <p className="text-white/80 mb-4">
                                Advertise your skills to employers or browse who's available in your area!
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    <span>Anonymous by default</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Area-based search</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{myAds.length}</div>
                            <div className="text-sm text-white/70">Your Ads</div>
                        </div>
                    </div>
                </div>

                {/* My Ads */}
                {myAds.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-woork-navy mb-4">Your Skill Listings</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myAds.map(ad => (
                                <div key={ad.id} className="bg-white rounded-xl p-4 border-2 border-woork-teal">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${ad.type === "available" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {ad.type === "available" ? "Available Now" : "Looking for Work"}
                                        </span>
                                        <span className="text-xs text-gray-500">{ad.applications} views</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {ad.skills.slice(0, 4).map(skill => (
                                            <span key={skill} className="skill-badge text-xs">{skill}</span>
                                        ))}
                                        {ad.skills.length > 4 && (
                                            <span className="text-xs text-gray-500">+{ad.skills.length - 4}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ad.bio}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        {ad.teenArea}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search & Filters */}
                <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search skills, experience, name..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                            />
                        </div>
                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                        >
                            <option value="">All Areas</option>
                            {metroAreas.map(area => (
                                <option key={area.value} value={area.value}>{area.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-woork-navy">
                        {filteredAds.length} {filteredAds.length === 1 ? "person" : "people"} found
                    </h2>
                </div>

                {filteredAds.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-woork-navy mb-2">No skill listings yet</h3>
                        <p className="text-gray-500 mb-6">Be the first to advertise your skills!</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary"
                        >
                            Post Your Skills
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAds.map(ad => (
                            <div key={ad.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-woork-navy">{ad.teenName}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin className="w-3 h-3" />
                                            {ad.teenArea}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${ad.type === "available" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {ad.type === "available" ? "Available" : "Looking"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {ad.skills.slice(0, 5).map(skill => (
                                        <span key={skill} className="skill-badge text-xs">{skill}</span>
                                    ))}
                                    {ad.skills.length > 5 && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            +{ad.skills.length - 5}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.bio}</p>

                                {ad.experience && (
                                    <p className="text-xs text-gray-500 mb-3">
                                        <Star className="w-3 h-3 inline mr-1" />
                                        {ad.experience}
                                    </p>
                                )}

                                {ad.availability && (
                                    <p className="text-xs text-gray-500 mb-3">
                                        <Calendar className="w-3 h-3 inline mr-1" />
                                        {ad.availability}
                                    </p>
                                )}

                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <button className="flex-1 btn-primary text-sm py-2">
                                        Message
                                    </button>
                                    <button className="flex-1 btn-secondary text-sm py-2">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-woork-navy">Post Your Skills</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">What are you looking for?</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setNewAd({ ...newAd, type: "available" })}
                                        className={`flex-1 p-3 rounded-lg border-2 transition-colors ${newAd.type === "available"
                                            ? "border-woork-teal bg-woork-teal/10"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <Check className={`w-5 h-5 mx-auto mb-1 ${newAd.type === "available" ? "text-woork-teal" : "text-gray-300"}`} />
                                        <div className="text-sm font-medium">I'm Available</div>
                                        <div className="text-xs text-gray-500">Employers can hire me</div>
                                    </button>
                                    <button
                                        onClick={() => setNewAd({ ...newAd, type: "looking" })}
                                        className={`flex-1 p-3 rounded-lg border-2 transition-colors ${newAd.type === "looking"
                                            ? "border-woork-teal bg-woork-teal/10"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <Search className={`w-5 h-5 mx-auto mb-1 ${newAd.type === "looking" ? "text-woork-teal" : "text-gray-300"}`} />
                                        <div className="text-sm font-medium">Looking for Work</div>
                                        <div className="text-xs text-gray-500">Tell employers you're interested</div>
                                    </button>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select your skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {commonSkills.map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => {
                                                if (newAd.skills.includes(skill)) {
                                                    setNewAd({
                                                        ...newAd,
                                                        skills: newAd.skills.filter(s => s !== skill)
                                                    });
                                                } else {
                                                    setNewAd({
                                                        ...newAd,
                                                        skills: [...newAd.skills, skill]
                                                    });
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${newAd.skills.includes(skill)
                                                ? "bg-woork-teal text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {newAd.skills.includes(skill) && <Check className="w-3 h-3 inline mr-1" />}
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tell employers about yourself</label>
                                <textarea
                                    value={newAd.bio}
                                    onChange={(e) => setNewAd({ ...newAd, bio: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                    placeholder="Hi! I'm a motivated teen looking for weekend work. I'm great with customers and always on time..."
                                />
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Any experience? (optional)</label>
                                <input
                                    type="text"
                                    value={newAd.experience}
                                    onChange={(e) => setNewAd({ ...newAd, experience: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                    placeholder="e.g., 1 year retail, volunteered at school canteen"
                                />
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">When are you available? (optional)</label>
                                <input
                                    type="text"
                                    value={newAd.availability}
                                    onChange={(e) => setNewAd({ ...newAd, availability: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-woork-teal focus:border-transparent"
                                    placeholder="e.g., Weekends, After school"
                                />
                            </div>

                            {/* Privacy Note */}
                            <div className="bg-woork-teal/10 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-woork-teal mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-woork-navy text-sm">Your privacy is protected</h4>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Your name is shown (first name + last initial only) and your metro area.
                                            Your exact address is never shown. Employers must contact you through woork.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createSkillAd}
                                disabled={creating || newAd.skills.length === 0}
                                className="flex-1 px-4 py-2 bg-woork-teal text-white rounded-lg hover:bg-woork-teal/90 transition-colors disabled:opacity-50"
                            >
                                {creating ? "Posting..." : "Post Skills"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
