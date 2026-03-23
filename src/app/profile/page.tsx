"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    User,
    MapPin,
    Calendar,
    Plus,
    X,
    Check,
    ChevronRight,
    ChevronLeft,
    Upload,
    Phone,
    Mail,
    Shield,
    Search,
    BookOpen,
    Save,
    Star,
    Building2,
    Lightbulb,
    Trash2
} from "lucide-react";
import { useAuth } from "@/components/providers";

type Step = "basics" | "location" | "skills" | "experience" | "availability" | "research" | "review";

interface ProfileData {
    // Basics
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    bio: string;
    profilePhoto: string;

    // Location
    suburb: string;
    state: string;
    postcode: string;

    // Skills
    skills: { id: string; name: string; level: string }[];

    // Experience
    experience: {
        id: string;
        title: string;
        company: string;
        description: string;
        startDate: string;
        endDate: string;
        current: boolean;
    }[];

    // Education
    education: {
        id: string;
        school: string;
        year: string;
        level: string;
    }[];

    // Availability
    availability: {
        [key: string]: string[];
    };

    // Research Notes
    researchNotes: {
        id: string;
        title: string;
        content: string;
        type: "employer" | "job" | "industry" | "general";
        tags: string[];
        createdAt: string;
        updatedAt: string;
    }[];
}

const AUSTRALIAN_STATES = [
    { code: "NSW", name: "New South Wales" },
    { code: "VIC", name: "Victoria" },
    { code: "QLD", name: "Queensland" },
    { code: "WA", name: "Western Australia" },
    { code: "SA", name: "South Australia" },
    { code: "TAS", name: "Tasmania" },
    { code: "ACT", name: "Australian Capital Territory" },
    { code: "NT", name: "Northern Territory" },
];

const COMMON_SKILLS = [
    "Customer Service",
    "Communication",
    "Teamwork",
    "Time Management",
    "Computer Skills",
    "Cash Handling",
    "Food Handling",
    "Cashier",
    "Retail",
    "Hospitality",
    "Barista",
    "Waitstaff",
    "Kitchen Hand",
    "Delivery",
    "Driving",
    "Maths",
    "Reading",
    "Writing",
    "Phone Skills",
];

export default function ProfilePage() {
    const { user, loading: authLoading, userType } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>("basics");
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        bio: "",
        profilePhoto: "",
        suburb: "",
        state: "",
        postcode: "",
        skills: [],
        experience: [],
        education: [],
        availability: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
        },
        researchNotes: [],
    });

    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: "basics", label: "Basics", icon: <User className="w-5 h-5" /> },
        { key: "location", label: "Location", icon: <MapPin className="w-5 h-5" /> },
        { key: "skills", label: "Skills", icon: <Check className="w-5 h-5" /> },
        { key: "experience", label: "Experience", icon: <Briefcase className="w-5 h-5" /> },
        { key: "availability", label: "Availability", icon: <Calendar className="w-5 h-5" /> },
        { key: "research", label: "Research", icon: <BookOpen className="w-5 h-5" /> },
        { key: "review", label: "Review", icon: <Check className="w-5 h-5" /> },
    ];

    const stepIndex = steps.findIndex(s => s.key === currentStep);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Redirect non-teens to their appropriate dashboards
    useEffect(() => {
        if (!authLoading && user && userType && userType !== "teen") {
            if (userType === "employer") {
                router.push("/employer/dashboard");
            } else if (userType === "parent") {
                router.push("/parent/dashboard");
            }
        }
    }, [user, authLoading, userType, router]);

    const handleNext = () => {
        const nextIndex = stepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].key);
        }
    };

    const handleBack = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].key);
        }
    };

    const addSkill = (skillName: string) => {
        if (!profile.skills.find(s => s.name === skillName)) {
            setProfile({
                ...profile,
                skills: [...profile.skills, { id: Date.now().toString(), name: skillName, level: "beginner" }],
            });
        }
    };

    const removeSkill = (skillId: string) => {
        setProfile({
            ...profile,
            skills: profile.skills.filter(s => s.id !== skillId),
        });
    };

    const addExperience = () => {
        setProfile({
            ...profile,
            experience: [
                ...profile.experience,
                {
                    id: Date.now().toString(),
                    title: "",
                    company: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                },
            ],
        });
    };

    const removeExperience = (id: string) => {
        setProfile({
            ...profile,
            experience: profile.experience.filter(e => e.id !== id),
        });
    };

    const toggleAvailability = (day: string, time: string) => {
        const current = profile.availability[day] || [];
        const newAvailability = current.includes(time)
            ? current.filter(t => t !== time)
            : [...current, time];
        setProfile({
            ...profile,
            availability: { ...profile.availability, [day]: newAvailability },
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case "basics":
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <User className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">Tell us about yourself</h2>
                            <p className="text-gray-600">This will be the start of your profile</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    className="input-field"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    className="input-field"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                            <input
                                type="date"
                                value={profile.dateOfBirth}
                                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                className="input-field"
                            />
                            <p className="text-xs text-gray-500 mt-1">You must be at least 13 years old to use woork</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="input-field"
                                placeholder="0400 000 000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="input-field min-h-[120px]"
                                placeholder="Tell employers about yourself - your interests, what you're looking for, and why you'd be a great employee..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-woork-teal transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Click to upload a photo</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                );

            case "location":
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <MapPin className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">Where do you live?</h2>
                            <p className="text-gray-600">Help employers find you</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
                            <input
                                type="text"
                                value={profile.suburb}
                                onChange={(e) => setProfile({ ...profile, suburb: e.target.value })}
                                className="input-field"
                                placeholder="Sydney"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <select
                                    value={profile.state}
                                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">Select state</option>
                                    {AUSTRALIAN_STATES.map(state => (
                                        <option key={state.code} value={state.code}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                                <input
                                    type="text"
                                    value={profile.postcode}
                                    onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                                    className="input-field"
                                    placeholder="2000"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div className="bg-woork-teal/10 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-woork-teal mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-woork-navy">Your location is private</h4>
                                    <p className="text-sm text-gray-600">Employers only see your suburb and state, not your exact address</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "skills":
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <Check className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">What skills do you have?</h2>
                            <p className="text-gray-600">Select skills you've developed</p>
                        </div>

                        {/* Selected Skills */}
                        {profile.skills.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-3">Your Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map(skill => (
                                        <span
                                            key={skill.id}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-woork-teal text-white text-sm"
                                        >
                                            {skill.name}
                                            <button onClick={() => removeSkill(skill.id)} className="hover:text-red-200">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Common Skills */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Tap to add skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {COMMON_SKILLS.filter(s => !profile.skills.find(ps => ps.name === s)).map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => addSkill(skill)}
                                        className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm hover:border-woork-teal hover:text-woork-teal transition-colors"
                                    >
                                        + {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Skill */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Add a custom skill</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="input-field flex-1"
                                    placeholder="e.g., Violin, Photography"
                                    id="customSkill"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById("customSkill") as HTMLInputElement;
                                        if (input.value) {
                                            addSkill(input.value);
                                            input.value = "";
                                        }
                                    }}
                                    className="btn-primary"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case "experience":
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <Briefcase className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">Any experience?</h2>
                            <p className="text-gray-600">Jobs, volunteering, school activities</p>
                        </div>

                        {profile.experience.map((exp, index) => (
                            <div key={exp.id} className="bg-gray-50 rounded-xl p-4 relative">
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => {
                                                const updated = [...profile.experience];
                                                updated[index].title = e.target.value;
                                                setProfile({ ...profile, experience: updated });
                                            }}
                                            className="input-field"
                                            placeholder="e.g., Sales Assistant"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organisation</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => {
                                                const updated = [...profile.experience];
                                                updated[index].company = e.target.value;
                                                setProfile({ ...profile, experience: updated });
                                            }}
                                            className="input-field"
                                            placeholder="e.g., Local Cafe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => {
                                                const updated = [...profile.experience];
                                                updated[index].description = e.target.value;
                                                setProfile({ ...profile, experience: updated });
                                            }}
                                            className="input-field min-h-[80px]"
                                            placeholder="What did you do?"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="month"
                                                value={exp.startDate}
                                                onChange={(e) => {
                                                    const updated = [...profile.experience];
                                                    updated[index].startDate = e.target.value;
                                                    setProfile({ ...profile, experience: updated });
                                                }}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="month"
                                                value={exp.endDate}
                                                onChange={(e) => {
                                                    const updated = [...profile.experience];
                                                    updated[index].endDate = e.target.value;
                                                    setProfile({ ...profile, experience: updated });
                                                }}
                                                className="input-field"
                                                disabled={exp.current}
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exp.current}
                                            onChange={(e) => {
                                                const updated = [...profile.experience];
                                                updated[index].current = e.target.checked;
                                                if (e.target.checked) {
                                                    updated[index].endDate = "";
                                                }
                                                setProfile({ ...profile, experience: updated });
                                            }}
                                            className="w-4 h-4 text-woork-teal rounded"
                                        />
                                        <span className="text-sm text-gray-600">I currently work here</span>
                                    </label>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addExperience}
                            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-woork-teal hover:text-woork-teal transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Experience
                        </button>
                    </div>
                );

            case "availability":
                const timeSlots = [
                    "Morning (6am-12pm)",
                    "Afternoon (12pm-5pm)",
                    "Evening (5pm-9pm)",
                    "Late (9pm-12am)",
                ];

                const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <Calendar className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">When can you work?</h2>
                            <p className="text-gray-600">Select your available times</p>
                        </div>

                        {days.map(day => (
                            <div key={day} className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-medium text-woork-navy capitalize mb-3">{day}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {timeSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => toggleAvailability(day, time)}
                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${(profile.availability[day] || []).includes(time)
                                                ? "bg-woork-teal text-white"
                                                : "bg-white border border-gray-200 text-gray-600 hover:border-woork-teal"
                                                }`}
                                        >
                                            {time.replace(" (", "\n(")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="bg-woork-coral/10 rounded-xl p-4">
                            <h4 className="font-medium text-woork-navy mb-2">School holidays?</h4>
                            <p className="text-sm text-gray-600">You'll be able to update your availability during school holidays</p>
                        </div>
                    </div>
                );

            case "research":
                // Industry information for teens to research
                const industries = [
                    { id: "retail", name: "Retail & Customer Service", desc: "Working in shops, helping customers, handling money", icon: "🛒" },
                    { id: "hospitality", name: "Hospitality & Food", desc: "Cafes, restaurants, hotels, food preparation", icon: "🍽️" },
                    { id: "healthcare", name: "Healthcare & Childcare", desc: "Aged care, childcare, health support", icon: "🏥" },
                    { id: "administration", name: "Administration & Office", desc: "Office work, data entry, customer service", icon: "💼" },
                    { id: "trades", name: "Trades & Construction", desc: "Building, electrical, plumbing, automotive", icon: "🔧" },
                    { id: "technology", name: "Technology & IT", desc: "Coding, tech support, digital media", icon: "💻" },
                    { id: "sports", name: "Sports & Recreation", desc: "Gym, sports coaching, recreation centres", icon: "⚽" },
                    { id: "entertainment", name: "Entertainment & Events", desc: "Events, photography, performing arts", icon: "🎭" },
                ];

                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">Research Jobs & Employers</h2>
                            <p className="text-gray-600">Learn about different jobs before you apply!</p>
                        </div>

                        {/* Industry Exploration */}
                        <div className="bg-gradient-to-r from-woork-teal/10 to-woork-navy/10 rounded-xl p-4">
                            <h3 className="font-semibold text-woork-navy mb-3 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-woork-teal" />
                                Explore Industries
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Not sure what you want to do? Click on an industry to learn what it's like!
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {industries.map(ind => (
                                    <button
                                        key={ind.id}
                                        className="text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100"
                                    >
                                        <div className="text-2xl mb-1">{ind.icon}</div>
                                        <div className="font-medium text-woork-navy text-sm">{ind.name}</div>
                                        <div className="text-xs text-gray-500">{ind.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Research Notes Section */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <h3 className="font-semibold text-woork-navy mb-3 flex items-center gap-2">
                                <Save className="w-5 h-5 text-woork-coral" />
                                Your Research Notes
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Save notes about jobs and employers you're interested in!
                            </p>

                            {profile.researchNotes && profile.researchNotes.length > 0 ? (
                                <div className="space-y-3 mb-4">
                                    {profile.researchNotes.map((note) => (
                                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${note.type === "employer" ? "bg-blue-100 text-blue-700" :
                                                                note.type === "job" ? "bg-green-100 text-green-700" :
                                                                    note.type === "industry" ? "bg-purple-100 text-purple-700" :
                                                                        "bg-gray-100 text-gray-700"
                                                            }`}>
                                                            {note.type}
                                                        </span>
                                                        <span className="font-medium text-woork-navy">{note.title}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                                                    {note.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {note.tags.map((tag, i) => (
                                                                <span key={i} className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setProfile({
                                                            ...profile,
                                                            researchNotes: profile.researchNotes.filter(n => n.id !== note.id)
                                                        });
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg mb-4">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No research notes yet</p>
                                    <p className="text-xs">Start researching jobs and employers!</p>
                                </div>
                            )}

                            {/* Add Note Form */}
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-woork-navy mb-2">Add a new note</p>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="What are you researching? (e.g., 'McDonalds', 'Retail Assistant')"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        id="researchTitle"
                                    />
                                    <textarea
                                        placeholder="Write your notes here... What did you learn? What do you like about it?"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        rows={2}
                                        id="researchContent"
                                    />
                                    <div className="flex gap-2">
                                        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm" id="researchType">
                                            <option value="general">General</option>
                                            <option value="employer">Employer</option>
                                            <option value="job">Job Type</option>
                                            <option value="industry">Industry</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Tags (comma separated)"
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            id="researchTags"
                                        />
                                        <button
                                            onClick={() => {
                                                const titleInput = document.getElementById("researchTitle") as HTMLInputElement;
                                                const contentInput = document.getElementById("researchContent") as HTMLTextAreaElement;
                                                const typeSelect = document.getElementById("researchType") as HTMLSelectElement;
                                                const tagsInput = document.getElementById("researchTags") as HTMLInputElement;

                                                if (titleInput.value.trim()) {
                                                    const newNote = {
                                                        id: Date.now().toString(),
                                                        title: titleInput.value,
                                                        content: contentInput.value,
                                                        type: typeSelect.value as "employer" | "job" | "industry" | "general",
                                                        tags: tagsInput.value.split(",").map(t => t.trim()).filter(t => t),
                                                        createdAt: new Date().toISOString(),
                                                        updatedAt: new Date().toISOString()
                                                    };
                                                    setProfile({
                                                        ...profile,
                                                        researchNotes: [...(profile.researchNotes || []), newNote]
                                                    });
                                                    titleInput.value = "";
                                                    contentInput.value = "";
                                                    tagsInput.value = "";
                                                }
                                            }}
                                            className="px-4 py-2 bg-woork-teal text-white rounded-lg text-sm hover:bg-woork-teal/90"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-woork-navy/5 rounded-xl p-4">
                            <h3 className="font-semibold text-woork-navy mb-2">💡 Research Tips</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Look up companies you're interested in on their website</li>
                                <li>• Check reviews on Google or Indeed to see what employees say</li>
                                <li>• Ask parents or friends about their work experiences</li>
                                <li>• Watch videos about different jobs on YouTube</li>
                                <li>• Take notes so you remember why you want to apply!</li>
                            </ul>
                        </div>
                    </div>
                );

            case "review":
                const calculateAge = (dob: string) => {
                    if (!dob) return 0;
                    const today = new Date();
                    const birthDate = new Date(dob);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age;
                };

                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-woork-teal/20 mx-auto mb-4 flex items-center justify-center">
                                <Check className="w-12 h-12 text-woork-teal" />
                            </div>
                            <h2 className="text-xl font-bold text-woork-navy">Review your profile</h2>
                            <p className="text-gray-600">Make sure everything looks good!</p>
                        </div>

                        {/* Preview Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-woork-teal to-woork-navy p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h3>
                                        <p className="text-white/80">{calculateAge(profile.dateOfBirth)} years old</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {profile.suburb && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        {profile.suburb}, {profile.state} {profile.postcode}
                                    </div>
                                )}

                                {profile.bio && (
                                    <p className="text-gray-600">{profile.bio}</p>
                                )}

                                {profile.skills.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-woork-navy mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map(skill => (
                                                <span key={skill.id} className="skill-badge">{skill.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> A parent or guardian will need to approve your profile before employers can see it.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-woork-teal/30 border-t-woork-teal rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-woork-navy">woork</span>
                        </Link>
                        <span className="text-sm text-gray-500">Step {stepIndex + 1} of {steps.length}</span>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-1">
                        {steps.map((step, index) => (
                            <div
                                key={step.key}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${index <= stepIndex ? "bg-woork-teal" : "bg-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                {renderStep()}
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-2xl mx-auto flex gap-4">
                    {stepIndex > 0 && (
                        <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                    )}
                    {currentStep !== "review" ? (
                        <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            Save Profile
                        </button>
                    )}
                </div>
            </footer>

            {/* Spacer for fixed footer */}
            <div className="h-24" />
        </div>
    );
}
